# E2E Test Scenarios for User Story KX5

## "As an **Urban Planner**, I want to adjust/define the georeferencing of a document on the map so that I can study its relationship to the territory"

### **Scenario 1**: Attempt to modify a non-existent document

```txt
Precondition: The user is on the map page, and markers for georeferenced documents are displayed.
Steps:
1. The user clicks on a marker or attempts to open the edit form for a document that no longer exists.
Expected Result: An error message is displayed: "Document not found!" and the form is not opened.
```
---

### **Scenario 2**: Modify an existing document successfully

```txt
Precondition: The user is on the map page, and markers for georeferenced documents are displayed.
Steps:
1. The user clicks on a marker for an existing document.
2. The user clicks on the edit button.
3. The form opens, prefilled with the document’s current data.
4. The user modifies one or more fields (e.g., updates title, changes latitude and longitude, or switches to "allMunicipality").
5. The user clicks the "Save Document" button.
Expected Result: The changes are saved successfully. A success message is displayed: "Document updated successfully." The map and document details are updated accordingly.
```

---

### **Scenario 3**: Attempt to save document with invalid values

```txt
Precondition: The user is on the map page, and markers for georeferenced documents are displayed.
Steps:
1. The user clicks on a marker for an existing document.
2. The user clicks on the edit button.
3. The form opens, prefilled with the document’s current data.
4. The user enters invalid values in one or more fields (e.g., invalid coordinates, empty title).
5. The user clicks the "Save Document" button.
Expected Result: The form displays an error message corresponding to the invalid fields. The document is not saved until valid data is entered.
```

---

### **Scenario 4**: Discard changes when clicking on 'x' button and confirming in popup

```txt
Precondition: The user is on the map page, has opened the form for an existing document, and made unsaved changes.
Steps:
1. The user clicks on the 'x' button to close the form.
2. A confirmation popup appears with a message and options Yes and No.
3. The user clicks Yes.
Expected Result: The form closes without saving any changes. The document retains its original data. The map and document details remain unchanged.
```

---

### **Scenario 5**: Cancel discard changes by clicking 'No' in popup

```txt
Precondition: The user is on the map page, has opened the form for an existing document, and made unsaved changes.
Steps:
1. The user clicks on the 'x' button to close the form.
2. A confirmation popup appears with a message and options Yes and No.
3. The user clicks No.
Expected Result: The popup closes. The form remains open, retaining the unsaved changes for further editing.
```