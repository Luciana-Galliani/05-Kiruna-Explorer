
---

## **E2E Test Scenarios for User Story KX7**

## "As an **Urban Planner**, I want to add one or more original resources for a document"

---

### **Scenario 1**: Select a document and add two original resources

**Precondition**: the user is logged as Urban Planner.
1. The user clicks on the burger menu to open the options.  
2. The user selects "All Documents" to view all documents.  
3. Alternatively, the user selects "All Municipality" to view only documents where "allMunicipality = true". 
4. The user select the document.
4. The user click on modify and add original resources 
**Expected Result**:  
- The result is that on the document there are the added original resources

### **Scenario 2**: Create a new document

**Precondition**: the user is logged as Urban Planner.
1. The user clicks on the create button.
1. The user fill the required fields for create the document
1. Additionally the user insert a new original resources
1. Click on create button.
**Expected Result**:  
- The result is that on the document there are the added original resources

### **Scenario 3**: Ensure correctly uploaded the resources

**Precondition**: the user is logged as Urban Planner, and already upload original resources
1. The user select the document with the original resources (from allDocuments or on the map).
1. See the document info and select the available original resources.
**Expected Result**:
- The logged user can download the original resources.