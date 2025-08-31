# React Form with Selenium Testing

A React application that implements a mini Google Form with validation and automated Selenium testing.

## Features

- Form with various input types: text, email, number, select, radio buttons, and checkboxes
- Form validation for all fields
- "Thank You" page displaying submitted information
- React Router for navigation between pages
- Bootstrap styling for a clean, responsive UI
- Comprehensive Selenium tests

## Project Structure

- `src/components/Form.js` - The form component with validation
- `src/components/ThankYou.js` - The thank you page displaying submitted data
- `test/form.test.js` - Selenium tests for the form functionality

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- Chrome browser (for Selenium tests)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Running the Tests

To run the Selenium tests, you need to:

1. First, start the application:
```bash
npm start
```

2. Then, in a separate terminal, run the Selenium tests:
```bash
npm run test:selenium
```

## Test Cases

1. **Valid Form Submission** - Tests if submitting a form with valid inputs navigates to the Thank You page.
2. **Name Validation** - Tests if leaving name blank shows appropriate error.
3. **Email Validation** - Tests if entering invalid email shows appropriate error.
4. **Age Validation** - Tests if entering negative age shows appropriate error.
5. **Gender Validation** - Tests if not selecting a gender shows appropriate error.
6. **Multiple Interests** - Tests if selecting multiple interests displays them correctly on the Thank You page.

## Dependencies

- React and React DOM
- React Router DOM
- Bootstrap
- Selenium WebDriver
- Mocha
- Chai

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
