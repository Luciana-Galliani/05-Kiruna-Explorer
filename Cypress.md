# Cypress Documentation

This document provides an overview of Cypress, a modern testing framework for web applications, including its purpose, features, and usage. It also covers installation, execution commands, and the structure of folders created during setup.

## Introduction

Cypress is a powerful, fast, and reliable end-to-end testing framework for web applications. It enables developers to write tests for various scenarios, including end-to-End Testing (simulate user actions across the application).

The key features are:
1. Real-time reloading: Automatically reloads tests on code changes.
2. Time-travel debugging: Lets you step through each command visually.
3. Automatic waiting: Waits for elements to load without manual commands.
4. Built-in test runner: Runs tests interactively in the browser.
5. Comprehensive API: Simplifies common testing tasks.

## Installation

**Note**: before installing Cypress, ensure you have Node.js installed on your system.

In order to install the application it is needed this few command:
- `npm install cypress --save-dev`
This installs Cypress as a development dependency in the project.
- `npx cypress open`
This opens the Cypress app, allowing you to run tests and view results interactively.

Once the Cypress app is open you need to choose the type of test you want to run, in this case E2E Testing.

Then you need to choose the browser on which you prefer to run the tests.

## Configuration

**Note**: Make sure to start the application server before running tests

The Cypress configuration file (*cypress.config.js*) allows you to customize the framework's behavior.
In this file, configure your project path and server.

## Folder structure in Cypress

After running `npx cypress open` for the first time, Cypress creates a default folder structure under cypress/. Here's an overview of its contents:

1. cypress/e2e
This is where you write your end-to-end test files. Test files typically have the .cy.js, .cy.ts, or .cy.jsx extension.

Example: login.cy.js for testing the login page.

2. cypress/fixtures
Contains static data used during tests, such as mock responses or pre-defined datasets in .json format.

Example: user.json could store mock user credentials.

3. cypress/support
This folder contains reusable code and custom commands.

commands.js: Define custom commands for repetitive tasks.
e2e.js: Global configuration and behavior for all tests.

4. cypress/screenshots
Automatically stores screenshots of failed tests (if enabled in configuration).

5. cypress/videos
Stores video recordings of test runs (if enabled). Useful for debugging failed tests in CI/CD environments.

6. cypress/results (optional)
A folder you can configure to save test result files, such as .xml or .json, for CI integration.

## Useful commands

- `npx cypress run`
This runs all tests in the default browser without opening the test runner UI.
- ` npx cypress run --spec "cypress/e2e/test.cy.js" `
To execute a specific test file (Remember to change 'test').
- `npx cypress run --browser chrome`
To specify the browser.