const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver'); // Load local chromedriver binary

// Helpers to make interactions more reliable in headless/CI
async function scrollIntoView(driver, el) {
  try {
    await driver.executeScript(
      'arguments[0].scrollIntoView({block: "center", inline: "nearest"});',
      el
    );
    await driver.sleep(150);
  } catch {}
}

async function safeClick(driver, el) {
  await scrollIntoView(driver, el);
  try {
    await el.click();
    return;
  } catch (e1) {
    try {
      await driver.actions({ bridge: true }).move({ origin: el }).press().release().perform();
      return;
    } catch (e2) {
      // Fallback to JS click
      await driver.executeScript('arguments[0].click();', el);
    }
  }
}

async function setSelectByValue(driver, selectEl, value) {
  await scrollIntoView(driver, selectEl);
  await driver.executeScript(
    "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
    selectEl,
    value
  );
}

describe('React Form Tests', function() {
  this.timeout(120000); // Increase timeout to 120s for test execution
  
  let driver;
  const baseUrl = 'http://127.0.0.1:3000';

  // Setup before running tests
  before(async function() {
    try {
      
  // Set up Chrome driver with options
  const options = new chrome.Options();
  // Tip: comment the next line if you want to see the browser UI
  options.addArguments('--headless=new'); // Run in headless mode
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      // Respect CHROME_BIN if provided by CI
      if (process.env.CHROME_BIN) {
        console.log('Using CHROME_BIN at:', process.env.CHROME_BIN);
        options.setChromeBinaryPath(process.env.CHROME_BIN);
      }
      
      console.log('Using chromedriver at:', chromedriver.path);
      
      // Create the driver with explicit chromedriver path
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .setChromeService(new chrome.ServiceBuilder(chromedriver.path)) // Explicitly use local chromedriver
        .build();      
    //   console.log('Chrome driver built successfully');
      
      // Ensure consistent viewport to reduce click interception in headless
      try {
        await driver.manage().window().setRect({ width: 1280, height: 900, x: 0, y: 0 });
      } catch {}
      
  // Navigate to the application
//   console.log(`Attempting to connect to application at ${baseUrl}...`);
  await driver.get(baseUrl);
      
  // Wait briefly to ensure page loads
  await driver.sleep(4000);
//   console.log('Current URL after load:', await driver.getCurrentUrl());

      console.log(`Successfully connected to the application at ${baseUrl}`);
    } catch (error) {
      console.error('Error setting up WebDriver:', error);
      throw error;
    }
  });

  // Close browser after tests
  after(async function() {
    if (driver) {
      try {
        // console.log('====================================');
        // console.log('CLEANING UP: Closing WebDriver');
        // Give it a little time before quitting
        await driver.sleep(1000);
        await driver.quit();
        // console.log('WebDriver successfully quit');
        // console.log('====================================');
      } catch (error) {
        console.error('Error quitting WebDriver:', error);
        // Force quit if normal quit fails
        try {
          driver.quit();
        } catch (e) {
        //   console.log('Forced quit attempt completed');
        }
      } finally {
        driver = null;
      }
    }
  });

  // Test 1: Submitting with valid inputs should navigate to Thank You page
  it('should navigate to Thank You page when form is valid', async function() {
    console.log('====================================');
    console.log('TEST 1: Valid form submission');
    console.log('====================================');
    
    try {
      // Navigate to the form
      console.log('Navigating to form...');
      await driver.get(baseUrl);
      
  // Wait for the page to load
  await driver.wait(until.elementLocated(By.css('body')), 15000);
  await driver.wait(until.elementLocated(By.id('name-input')), 15000);
      
      // Fill out the form with valid data
      console.log('Filling out form with valid data...');
      console.log('- Entering name: John Doe');
      const nameInput = await driver.findElement(By.id('name-input'));
      await nameInput.clear();
      await nameInput.sendKeys('John Doe');
      
      console.log('- Entering email: john.doe@example.com');
      const emailInput = await driver.findElement(By.id('email-input'));
      await emailInput.clear();
      await emailInput.sendKeys('john.doe@example.com');
      
      console.log('- Entering age: 25');
      const ageInput = await driver.findElement(By.id('age-input'));
      await ageInput.clear();
      await ageInput.sendKeys('25');
      
      // Select country
      console.log('- Selecting country: USA');
  const countrySelect = await driver.findElement(By.id('country-select'));
  await scrollIntoView(driver, countrySelect);
  // Set value via script to avoid dropdown overlay issues
  await setSelectByValue(driver, countrySelect, 'USA');
      
      // Select gender
      console.log('- Selecting gender: Male');
  const genderMale = await driver.findElement(By.id('gender-male'));
  await safeClick(driver, genderMale);
      
      // Select interests
      console.log('- Selecting interests: Music, Coding');
  const musicInterest = await driver.findElement(By.id('interest-music'));
  await safeClick(driver, musicInterest);
  const codingInterest = await driver.findElement(By.id('interest-coding'));
  await safeClick(driver, codingInterest);
      
      // Submit the form
      console.log('Submitting form...');
  const submitButton = await driver.findElement(By.id('submit-btn'));
  await safeClick(driver, submitButton);
      
      // Wait for navigation to Thank You page
      await driver.wait(
        until.urlContains('/thank-you'), 
        10000, 
        'URL should contain /thank-you'
      );
      
      // Verify the Thank You page is loaded
      await driver.wait(until.elementLocated(By.css('.card-header')), 10000);
      const pageTitle = await driver.findElement(By.css('.card-header')).getText();
      expect(pageTitle).to.include('Thank You');
      console.log('Page title verified: ' + pageTitle);
      
      // Verify form data is displayed correctly
      await driver.wait(until.elementsLocated(By.css('.list-group-item')), 10000);
      const listItems = await driver.findElements(By.css('.list-group-item'));
      const dataTexts = await Promise.all(listItems.map(el => el.getText()));
      
      expect(dataTexts[0]).to.include('John Doe');
      expect(dataTexts[1]).to.include('john.doe@example.com');
      expect(dataTexts[2]).to.include('25');
      expect(dataTexts[3]).to.include('USA');
      expect(dataTexts[4]).to.include('Male');
      expect(dataTexts[5]).to.include('music, coding');
      console.log('All data verified successfully!');
      console.log('TEST 1 PASSED');
    } catch (error) {
      console.error('Test 1 failed:', error);
      throw error;
    }
  });
  
  // Test 2: Leaving name blank should show "Name required"
  it('should show error when name is blank', async function() {
    console.log('====================================');
    console.log('TEST 2: Blank name validation');
    console.log('====================================');
    
    console.log('Navigating to form...');
    await driver.get(baseUrl);
    
    // Leave name blank, fill other required fields
    console.log('Filling form with blank name...');
    console.log('- Filling rest of the form correctly');
    await driver.findElement(By.id('email-input')).sendKeys('test@example.com');
    
    // console.log('- Filling age: 30');
    await driver.findElement(By.id('age-input')).sendKeys('30');
    
    // Select country
    // console.log('- Selecting country: UK');
  const countrySelect = await driver.findElement(By.id('country-select'));
  await setSelectByValue(driver, countrySelect, 'UK');
    
    // Select gender
    // console.log('- Selecting gender: Female');
  await safeClick(driver, await driver.findElement(By.id('gender-female')));
    
    // Submit form
    console.log('Submitting form...');
    await driver.findElement(By.id('submit-btn')).click();
    
    // Check for error message
    // console.log('Checking for name error message...');
    const errorMsg = await driver.findElement(By.className('error-msg')).getText();
    expect(errorMsg).to.include('Name is required');
    console.log('Error message verified: ' + errorMsg);
    console.log('TEST 2 PASSED');
  });
  
  // Test 3: Entering invalid email should show "Invalid email"
  it('should show error when email is invalid', async function() {
    console.log('====================================');
    console.log('TEST 3: Invalid email validation');
    console.log('====================================');
    
    console.log('Navigating to form...');
    await driver.get(baseUrl);
    
    // Fill out form with invalid email
    console.log('Filling form with invalid email...');
    console.log('- Entering invalid email: invalid-email');
    console.log('- Filling rest of the form correctly');
    await driver.findElement(By.id('name-input')).sendKeys('Jane Smith');
    
    await driver.findElement(By.id('email-input')).sendKeys('invalid-email');
    
    // console.log('- Entering age: 35');
    await driver.findElement(By.id('age-input')).sendKeys('35');
    
    // Select country
    // console.log('- Selecting country: Canada');
  const countrySelect = await driver.findElement(By.id('country-select'));
  await setSelectByValue(driver, countrySelect, 'Canada');
    
    // Select gender
    // console.log('- Selecting gender: Female');
  await safeClick(driver, await driver.findElement(By.id('gender-female')));
    
    // Submit form
    console.log('Submitting form...');
    await driver.findElement(By.id('submit-btn')).click();
    
    // Check for email error
    // console.log('Checking for email error message...');
    const errorMsgs = await driver.findElements(By.className('error-msg'));
    const errorTexts = await Promise.all(errorMsgs.map(el => el.getText()));
    
    const hasEmailError = errorTexts.some(text => text.includes('Invalid email'));
    expect(hasEmailError).to.be.true;
    console.log('Error messages found: ' + errorTexts.join(', '));
    console.log('TEST 3 PASSED');
  });
  
  // Test 4: Entering negative age should show "Age must be positive"
  it('should show error when age is negative', async function() {
    console.log('====================================');
    console.log('TEST 4: Negative age validation');
    console.log('====================================');
    
    console.log('Navigating to form...');
    await driver.get(baseUrl);
    
    // Fill out form with negative age
    console.log('Filling form with negative age...');
    console.log('- Entering negative age: -5');
    console.log('- Filling rest of the form correctly');
    await driver.findElement(By.id('name-input')).sendKeys('Tom Johnson');
    
    // console.log('- Entering email: tom@example.com');
    await driver.findElement(By.id('email-input')).sendKeys('tom@example.com');
    
    await driver.findElement(By.id('age-input')).sendKeys('-5');
    
    // Select country
    // console.log('- Selecting country: Australia');
  const countrySelect = await driver.findElement(By.id('country-select'));
  await setSelectByValue(driver, countrySelect, 'Australia');
    
    // Select gender
    // console.log('- Selecting gender: Male');
  await safeClick(driver, await driver.findElement(By.id('gender-male')));
    
    // Submit form
    console.log('Submitting form...');
    await driver.findElement(By.id('submit-btn')).click();
    
    // Check for age error
    // console.log('Checking for age error message...');
    const errorMsgs = await driver.findElements(By.className('error-msg'));
    const errorTexts = await Promise.all(errorMsgs.map(el => el.getText()));
    
    const hasAgeError = errorTexts.some(text => text.includes('Age must be a positive'));
    expect(hasAgeError).to.be.true;
    console.log('Error messages found: ' + errorTexts.join(', '));
    console.log('TEST 4 PASSED');
  });
  
  // Test 5: Submitting without selecting gender should show error
  it('should show error when gender is not selected', async function() {
    console.log('====================================');
    console.log('TEST 5: Gender selection validation');
    console.log('====================================');
    
    console.log('Navigating to form...');
    await driver.get(baseUrl);
    
    // Fill out form without selecting gender
    console.log('Filling form without selecting gender...');
    console.log('- Filling rest of the form correctly');
    await driver.findElement(By.id('name-input')).sendKeys('Alex White');
    
    // console.log('- Entering email: alex@example.com');
    await driver.findElement(By.id('email-input')).sendKeys('alex@example.com');
    
    // console.log('- Entering age: 40');
    await driver.findElement(By.id('age-input')).sendKeys('40');
    
    // Select country
    // console.log('- Selecting country: USA');
  const countrySelect = await driver.findElement(By.id('country-select'));
  await setSelectByValue(driver, countrySelect, 'USA');
    
    // Do not select gender
    
    // Submit form
    console.log('Submitting form...');
    await driver.findElement(By.id('submit-btn')).click();
    
    // Check for gender error
    // console.log('Checking for gender error message...');
    const errorMsgs = await driver.findElements(By.className('error-msg'));
    const errorTexts = await Promise.all(errorMsgs.map(el => el.getText()));
    
    const hasGenderError = errorTexts.some(text => text.includes('Please select your gender'));
    expect(hasGenderError).to.be.true;
    console.log('Error messages found: ' + errorTexts.join(', '));
    console.log('TEST 5 PASSED');
  });
  
  // Test 6: Selecting multiple interests should display them on the Thank You page
  it('should display multiple interests on the Thank You page', async function() {
    console.log('====================================');
    console.log('TEST 6: Multiple interests display');
    console.log('====================================');
    
    console.log('Navigating to form...');
    await driver.get(baseUrl);
    
    // Fill out form with all required fields
    console.log('Filling form with all required fields...');
    // console.log('- Entering name: Sarah Brown');
    await driver.findElement(By.id('name-input')).sendKeys('Sarah Brown');
    
    // console.log('- Entering email: sarah@example.com');
    await driver.findElement(By.id('email-input')).sendKeys('sarah@example.com');
    
    // console.log('- Entering age: 28');
    await driver.findElement(By.id('age-input')).sendKeys('28');
    
    // Select country
    // console.log('- Selecting country: Canada');
  const countrySelect = await driver.findElement(By.id('country-select'));
  await setSelectByValue(driver, countrySelect, 'Canada');
    
    // Select gender
    // console.log('- Selecting gender: Female');
  await safeClick(driver, await driver.findElement(By.id('gender-female')));
    
    // Select multiple interests
    console.log('- Selecting multiple interests: Music, Sports, Coding');
  await safeClick(driver, await driver.findElement(By.id('interest-music')));
  await safeClick(driver, await driver.findElement(By.id('interest-sports')));
  await safeClick(driver, await driver.findElement(By.id('interest-coding')));
    
    // Submit form
    console.log('Submitting form...');
  await safeClick(driver, await driver.findElement(By.id('submit-btn')));
    
    // Wait for navigation to Thank You page
    // console.log('Waiting for navigation to Thank You page...');
    await driver.wait(
      until.urlContains('/thank-you'), 
      5000, 
      'URL should contain /thank-you'
    );
    
    // Verify all interests are displayed
    // console.log('Verifying all interests are displayed...');
    const listItems = await driver.findElements(By.css('.list-group-item'));
    const interestsItem = await listItems[5].getText();
    
    expect(interestsItem).to.include('music');
    expect(interestsItem).to.include('sports');
    expect(interestsItem).to.include('coding');
    console.log('Interests verified: ' + interestsItem);
    console.log('TEST 6 PASSED');
    console.log('ALL TESTS COMPLETED');
  });
});
