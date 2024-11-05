# E2E Test Scenarios for User Story 1

## "As an **Urban Planner**, I want to add a new document description"

**Scenario 1**: Access document addition page

````txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
The user clicks on "Add Document".
Expected Result: A page or form for entering the new document details is displayed.
````

**Scenario 2**: Add new document with valid information

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

**Scenario 3**: Attempt to add document with missing description

```txt
Precondition: The user is on the document addition page.
Steps:
The user enters a valid title.
The user leaves the "Description" field empty.
The user clicks on "Save Document".
Expected Result: An error message appears indicating that all the fields are required, and the document is not saved.
```

**Scenario 4**: Attempt to add document with missing issuance date

```txt
Precondition: The user is on the document addition page.
Steps:
The user fills in all fields with valid information except for the "Issuance Date" field, which is left empty.
The user clicks on "Save Document".
Expected Result: An error message appears indicating that all the fields are required, and the document is not saved.
```

**Scenario 5**: Attempt to add document with missing dropdown selections (Type and Scale)

```txt
Precondition: The user is on the document addition page.
Steps:
The user fills in all fields except for the "Type" and "Scale" dropdown fields, which are left empty.
The user clicks on "Save Document".
Expected Result: An error message appears indicating that all the fields are required, and the document is not saved.
```

**Scenario 6**: Attempt to add document with missing stakeholders

```txt
Precondition: The user is on the document addition page.
Steps:
The user fills in all fields except for the "Stakeholders" field, which is left empty.
The user clicks on "Save Document".
Expected Result: An error message appears indicating that all the fields are required, and the document is not saved.
```

**Scenario 7**: Attempt to add document with empty pages field

```txt
Precondition: The user is on the document addition page.
Steps:
The user fills in all fields except for the "Pages" field, which is left empty.
The user clicks on "Save Document".
Expected Result: An error message appears indicating that all the fields are required, and the document is not saved.
```

**Scenario 8**: Logout

```txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
The user clicks on the "Logout" button.
Expected Result: The user is successfully logged out and redirected to the login page. Any unsaved information on the document addition page is cleared for security reasons.
```

**Scenario 9**: Attempt to access document addition page without login

```txt
Precondition: The user is not logged into the system.
Steps:
The user attempts to navigate directly to the document addition page (e.g., by entering the URL).
Expected Result: The user is redirected to the login page and prompted to log in. Access to the document addition page is restricted until the user has logged in successfully.
```
