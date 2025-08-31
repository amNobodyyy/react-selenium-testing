const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');

describe('React Form Tests', function() {
  this.timeout(30000); // Increase timeout for test execution
  
  let driver;
  const baseUrl = 'http://localhost:3000';

  // Setup before running tests
  before(async function() {
    // Set up Chrome driver
    const options = new chrome.Options();
    // options.addArguments('--headless'); // Uncomment to run in headless mode
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  // Close browser after tests
  after(async function() {
    await driver.quit();
  });

  // Test 1: Submitting with valid inputs should navigate to Thank You page
  it('should navigate to Thank You page when form is valid', async function() {
    // Navigate to the form
    await driver.get(baseUrl);
    
    // Fill out the form with valid data
    await driver.findElement(By.id('name-input')).sendKeys('John Doe');
    await driver.findElement(By.id('email-input')).sendKeys('john.doe@example.com');
    await driver.findElement(By.id('age-input')).sendKeys('25');
    
    // Select country
    const countrySelect = await driver.findElement(By.id('country-select'));
    await countrySelect.click();
    await countrySelect.findElement(By.css('option[value="USA"]')).click();
    
    // Select gender
    await driver.findElement(By.id('gender-male')).click();
    
    // Select interests
    await driver.findElement(By.id('interest-music')).click();
    await driver.findElement(By.id('interest-coding')).click();
    
    // Submit the form
    await driver.findElement(By.id('submit-btn')).click();
    
    // Wait for navigation to Thank You page
    await driver.wait(
      until.urlContains('/thank-you'), 
      5000, 
      'URL should contain /thank-you'
    );
    
    // Verify the Thank You page is loaded
    const pageTitle = await driver.findElement(By.css('.card-header')).getText();
    expect(pageTitle).to.include('Thank You');
    
    // Verify form data is displayed correctly
    const listItems = await driver.findElements(By.css('.list-group-item'));
    const dataTexts = await Promise.all(listItems.map(el => el.getText()));
    
    expect(dataTexts[0]).to.include('John Doe');
    expect(dataTexts[1]).to.include('john.doe@example.com');
    expect(dataTexts[2]).to.include('25');
    expect(dataTexts[3]).to.include('USA');
    expect(dataTexts[4]).to.include('Male');
    expect(dataTexts[5]).to.include('music, coding');
  });
  
  // Test 2: Leaving name blank should show "Name required"
  it('should show error when name is blank', async function() {
    await driver.get(baseUrl);
    
    // Leave name blank, fill other required fields
    await driver.findElement(By.id('email-input')).sendKeys('test@example.com');
    await driver.findElement(By.id('age-input')).sendKeys('30');
    
    // Select country
    const countrySelect = await driver.findElement(By.id('country-select'));
    await countrySelect.click();
    await countrySelect.findElement(By.css('option[value="UK"]')).click();
    
    // Select gender
    await driver.findElement(By.id('gender-female')).click();
    
    // Submit form
    await driver.findElement(By.id('submit-btn')).click();
    
    // Check for error message
    const errorMsg = await driver.findElement(By.className('error-msg')).getText();
    expect(errorMsg).to.include('Name is required');
  });
  
  // Test 3: Entering invalid email should show "Invalid email"
  it('should show error when email is invalid', async function() {
    await driver.get(baseUrl);
    
    // Fill out form with invalid email
    await driver.findElement(By.id('name-input')).sendKeys('Jane Smith');
    await driver.findElement(By.id('email-input')).sendKeys('invalid-email');
    await driver.findElement(By.id('age-input')).sendKeys('35');
    
    // Select country
    const countrySelect = await driver.findElement(By.id('country-select'));
    await countrySelect.click();
    await countrySelect.findElement(By.css('option[value="Canada"]')).click();
    
    // Select gender
    await driver.findElement(By.id('gender-female')).click();
    
    // Submit form
    await driver.findElement(By.id('submit-btn')).click();
    
    // Check for email error
    const errorMsgs = await driver.findElements(By.className('error-msg'));
    const errorTexts = await Promise.all(errorMsgs.map(el => el.getText()));
    
    expect(errorTexts.some(text => text.includes('Invalid email'))).to.be.true;
  });
  
  // Test 4: Entering negative age should show "Age must be positive"
  it('should show error when age is negative', async function() {
    await driver.get(baseUrl);
    
    // Fill out form with negative age
    await driver.findElement(By.id('name-input')).sendKeys('Tom Johnson');
    await driver.findElement(By.id('email-input')).sendKeys('tom@example.com');
    await driver.findElement(By.id('age-input')).sendKeys('-5');
    
    // Select country
    const countrySelect = await driver.findElement(By.id('country-select'));
    await countrySelect.click();
    await countrySelect.findElement(By.css('option[value="Australia"]')).click();
    
    // Select gender
    await driver.findElement(By.id('gender-male')).click();
    
    // Submit form
    await driver.findElement(By.id('submit-btn')).click();
    
    // Check for age error
    const errorMsgs = await driver.findElements(By.className('error-msg'));
    const errorTexts = await Promise.all(errorMsgs.map(el => el.getText()));
    
    expect(errorTexts.some(text => text.includes('Age must be a positive'))).to.be.true;
  });
  
  // Test 5: Submitting without selecting gender should show error
  it('should show error when gender is not selected', async function() {
    await driver.get(baseUrl);
    
    // Fill out form without selecting gender
    await driver.findElement(By.id('name-input')).sendKeys('Alex White');
    await driver.findElement(By.id('email-input')).sendKeys('alex@example.com');
    await driver.findElement(By.id('age-input')).sendKeys('40');
    
    // Select country
    const countrySelect = await driver.findElement(By.id('country-select'));
    await countrySelect.click();
    await countrySelect.findElement(By.css('option[value="USA"]')).click();
    
    // Do not select gender
    
    // Submit form
    await driver.findElement(By.id('submit-btn')).click();
    
    // Check for gender error
    const errorMsgs = await driver.findElements(By.className('error-msg'));
    const errorTexts = await Promise.all(errorMsgs.map(el => el.getText()));
    
    expect(errorTexts.some(text => text.includes('Please select your gender'))).to.be.true;
  });
  
  // Test 6: Selecting multiple interests should display them on the Thank You page
  it('should display multiple interests on the Thank You page', async function() {
    await driver.get(baseUrl);
    
    // Fill out form with all required fields
    await driver.findElement(By.id('name-input')).sendKeys('Sarah Brown');
    await driver.findElement(By.id('email-input')).sendKeys('sarah@example.com');
    await driver.findElement(By.id('age-input')).sendKeys('28');
    
    // Select country
    const countrySelect = await driver.findElement(By.id('country-select'));
    await countrySelect.click();
    await countrySelect.findElement(By.css('option[value="Canada"]')).click();
    
    // Select gender
    await driver.findElement(By.id('gender-female')).click();
    
    // Select multiple interests
    await driver.findElement(By.id('interest-music')).click();
    await driver.findElement(By.id('interest-sports')).click();
    await driver.findElement(By.id('interest-coding')).click();
    
    // Submit form
    await driver.findElement(By.id('submit-btn')).click();
    
    // Wait for navigation to Thank You page
    await driver.wait(
      until.urlContains('/thank-you'), 
      5000, 
      'URL should contain /thank-you'
    );
    
    // Verify all interests are displayed
    const listItems = await driver.findElements(By.css('.list-group-item'));
    const interestsItem = await listItems[5].getText();
    
    expect(interestsItem).to.include('music');
    expect(interestsItem).to.include('sports');
    expect(interestsItem).to.include('coding');
  });
});
