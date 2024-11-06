# E2E Test Scenarios for User Story 2

## "As an **Urban Planner**, I want to link documents to each other So that I can study their relationships"

**Scenario 1**: Add a connection to a new document

````txt
Precondition: The user is on the document addition form.
Steps:
-The user selects a document from the "Document" dropdown.
-The user selects a connection type from the "Type of Connection" dropdown.
-The user clicks on the "Add Connection" button.
Expected Result: The selected connection appears next to the form, showing the document and connection type.
```
````
**Scenario 2**: Add multiple connections to a new document

````txt
Precondition: The user is on the document addition form.
Steps:
-The user selects a document from the "Document" dropdown.
-The user selects a connection type from the "Type of Connection" dropdown.
-The user clicks on the "Add Connection" button.
-The user repeats these steps to add more connections.
Expected Result: Each added connection appears next to the form in a list format, showing the document and connection type for each one.
```
````
**Scenario 3**: Remove a connection from a new document

````txt
Precondition: The user has added one or more connections on the document addition form.
Steps:
-The user clicks on the "x" next to a specific connection to remove it.
Expected Result: The selected connection is removed from the list of connections without affecting other connections.
```
````
**Scenario 4**: Attempt to add a connection without selecting both fields

````txt
Precondition: The user is on the document addition form.
Steps:
-The user selects a document but leaves the "Type of Connection" field empty (or vice versa).
Expected Result: The user cannot click the "Add connection" button, and the connection is not added.
```
````
**Scenario 5**: View added connections before saving the new document

````txt
Precondition: The user is on the document addition form and has added one or more connections.
Steps:
-The user reviews the connections list displayed next to the form.
Expected Result: The list correctly displays all added connections with their respective document names and connection types, allowing the user to review connections before saving.
```
````
**Scenario 6**: Save new document with connections

````txt
Precondition: The user has filled in all required fields in the document addition form and added one or more connections.
Steps:
-The user clicks on the "Save Document" button to save the new document.
Expected Result: The document is saved successfully along with the connections.
```
````
**Scenario 7**: Attempt to save document without adding connections

````txt
Precondition: The user has filled in all other required fields but has not added any connections.
Steps:
-The user clicks on the "Save Document" button to save the document.
Expected Result: The document is saved successfully, as connections are optional.
```