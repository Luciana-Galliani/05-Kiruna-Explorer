# E2E Test Scenarios for User Story 1

## "As an **Urban Planner**, I want to add a new document description"

**Scenario 1**: Access login page from main page

````txt
Precondition: The user is on the main page.
Steps: The user clicks on the "Login" button.
Expected Result: The user is redirected to the login page, where a login form is displayed.
```
````
**Scenario 2**: Successful login with valid credentials

````txt
Precondition: The user is on the login page and has an existing account.
Steps:
    The user enters valid credentials in the form.
    The user clicks on the "Login" button.
Expected Result: The user is logged in successfully and redirected to their homepage.
````
**Scenario 3**: Attempted login with invalid credentials

````txt
Precondition: The user is on the login page and has an existing account.
Steps:
    The user enters incorrect or invalid credentials in the form.
    The user clicks on the "Login" button.
Expected Result: An error message appears indicating that the credentials are invalid, and the user remains on the login page.
````
**Scenario 4**: Access registration form from login page

````txt
Precondition: The user is on the login page.
Steps: The user clicks on the "Register here" link.
Expected Result: A registration form appears, allowing the user to enter information to create a new account.
````
**Scenario 5**: Return to main page from login or registration page using Cancel button

````txt
Precondition: The user is on the login page or has opened the registration form.
Steps: The user clicks on the "Cancel" button.
Expected Result: The user is redirected back to the main page, and any data entered in the form is discarded.
````
**Scenario 6**: Successful registration with valid information

````txt
Precondition: The user is on the registration form.
Steps:
    The user enters valid information in all required fields of the registration form.
    The user clicks on the "Register" button.
Expected Result: The user is successfully registered, and logged in directly.
````

**Scenario 7**: Attempted registration with missing or invalid information

````txt
Precondition: The user is on the registration form.
Steps:
    The user leaves one or more required fields empty or enters invalid information.
    The user clicks on the "Register" button.
Expected Result: An error message appears, indicating which fields need to be corrected or filled in. The user remains on the registration form until all required fields are completed with valid information.
````
**Scenario 8**: Access document addition page

````txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
The user clicks on the "+" button.
Expected Result: A page or form for entering the new document details is displayed.
````

**Scenario 9**: Add new document with valid information

```txt
Precondition: The user is on the document addition page.
Steps:
The user enters a title in the "Title" field.
The user enters names of relevant stakeholders in the "Stakeholders" field.
The user selects a valid issuance date using the calendar menu in the "Issuance Date" field.
The user selects an option from the "Type" dropdown.
The user selects an option from the "Scale" dropdown.
The user enters a language in the "Language" field.
The user enters a string or number in the "Pages" field.
The user enters a valid description in the "Description" field.
The user clicks on "Save Document".
Expected Result: The document is saved successfully, and the user is redirected to the document list, where they can see the new document with all entered information.
```

**Scenario 10**: Attempt to add document with missing description

```txt
Precondition: The user is on the document addition page.
Steps:
The user enters a valid title.
The user leaves the "Description" field empty.
The user clicks on "Save Document".
Expected Result: An error message appears indicating that all the fields are required, and the document is not saved.
```

**Scenario 11**: Attempt to add document with missing issuance date

```txt
Precondition: The user is on the document addition page.
Steps:
The user fills in all fields with valid information except for the "Issuance Date" field, which is left empty.
The user clicks on "Save Document".
Expected Result: An error message appears indicating that all the fields are required, and the document is not saved.
```

**Scenario 12**: Attempt to add document with missing dropdown selections (Type and Scale)

```txt
Precondition: The user is on the document addition page.
Steps:
The user fills in all fields except for the "Type" and "Scale" dropdown fields, which are left empty.
The user clicks on "Save Document".
Expected Result: An error message appears indicating that all the fields are required, and the document is not saved.
```

**Scenario 13**: Attempt to add document with missing stakeholders

```txt
Precondition: The user is on the document addition page.
Steps:
The user fills in all fields except for the "Stakeholders" field, which is left empty.
The user clicks on "Save Document".
Expected Result: An error message appears indicating that all the fields are required, and the document is not saved.
```

**Scenario 14**: Attempt to add document with empty pages field

```txt
Precondition: The user is on the document addition page.
Steps:
The user fills in all fields except for the "Pages" field, which is left empty.
The user clicks on "Save Document".
Expected Result: An error message appears indicating that all the fields are required, and the document is not saved.
```

**Scenario 15**: Logout

```txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
The user clicks on the "Logout" button.
Expected Result: The user is successfully logged out and redirected to the login page. Any unsaved information on the document addition page is cleared for security reasons.
```

**Scenario 16**: Attempt to access document addition page without login

```txt
Precondition: The user is not logged into the system.
Steps:
The user attempts to navigate directly to the document addition page (e.g., by entering the URL).
Expected Result: The user is redirected to the login page and prompted to log in. Access to the document addition page is restricted until the user has logged in successfully.
```
**Scenario 17**: Return to homepage from addition page using "x" button

```txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
The user clicks on the "x" button.
Expected Result: The user is successfullyredirected to the homepage. Any unsaved information on the document addition page is cleared for security reasons.
```