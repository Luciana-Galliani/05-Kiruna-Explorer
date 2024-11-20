
---

## **E2E Test Scenarios for User Story KX6**

## "As an **Urban Planner**, I want to list all documents"

---

### **Scenario 1**: Display all documents or only "allMunicipality" documents based on burger menu selection

**Precondition**: The user is on the page with the list of documents.  
**Steps**:  
1. The user clicks on the burger menu to open the options.  
2. The user selects "All Documents" to view all documents.  
3. Alternatively, the user selects "All Municipality" to view only documents where "allMunicipality = true".  
**Expected Result**:  
- When "All Documents" is selected, all documents are displayed in the list.  
- When "All Municipality" is selected, only documents with "allMunicipality = true" are displayed.  

---

### **Scenario 2**: Hover over a document to highlight it

**Precondition**: The user is on the page with the list of documents.  
**Steps**:  
1. The user moves the mouse cursor over a document in the list.  
**Expected Result**:  
- The document is highlighted with an active class (change in appearance).  

---

### **Scenario 3**: Select a document to view its details

**Precondition**: The user is on the page with the list of documents.  
**Steps**:  
1. The user clicks on a document in the list.  
2. The document's details panel is displayed with the information of the selected document.  
**Expected Result**:  
- The details panel opens with the correct document's title and other relevant information.  

---

### **Scenario 4**: Close the details panel when clicking the "Close" button

**Precondition**: The user has selected a document and the details panel is open.  
**Steps**:  
1. The user clicks on the "Close" button inside the details panel.  
**Expected Result**:  
- The details panel closes and the document list is displayed again.  
- The selected document is deselected and no document details are shown.  

---

### **Scenario 5**: Display a message when no documents match the filter condition

**Precondition**: The API returns an empty list of documents for the current condition.  
**Steps**:  
1. The user navigates to the page where the list of documents is displayed.  
2. The system fetches documents from the API and no documents match the selected condition.  
**Expected Result**:  
- A message such as "No documents available" is displayed.  
- The list remains empty with no document items shown.  

---

### **Scenario 6**: Ensure document list updates when burger menu option changes

**Precondition**: The user is on the page with the list of documents, and the burger menu is visible.  
**Steps**:  
1. The user clicks on the burger menu to open the options.  
2. The user selects a different option from the menu (e.g., "All Documents" or "All Municipality").  
**Expected Result**:  
- The displayed list of documents updates accordingly (either all documents or only those with "allMunicipality = true").  

---
