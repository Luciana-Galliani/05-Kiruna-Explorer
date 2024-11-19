# E2E Test Scenarios for User Story KX4

## "As a **resident/visitor/urban planner**, I want to view the documents on the map so that I can see to which position or area they relate."

### **Scenario 1**: Display all documents on the map

```txt
Precondition: The user is on the map page, and documents with georeferenced locations exist.
Steps:
1. The map loads automatically.
Expected Result: The map displays icons for all available georeferenced documents.
```

---

### **Scenario 2**: View document details by clicking on a marker

```txt
Precondition: The user is on the map page, and markers for georeferenced documents are displayed.
Steps:
1. The user clicks on a document marker on the map.
Expected Result: A panel appears, showing details of the selected document, including its title, description, and other attributes.
```

---

### **Scenario 3**: See "All municipality" documents

```txt
Precondition: The user is on the map page, and "All municipality" documents exist.
Steps:
1. The user click on the "All municipality" button.
Expected Result: A list with all the "all municipality" documents appears.
```

---

### **Scenario 4**: Zoom in/out on the map

```txt
Precondition: The user is on the map page, and documents are displayed on the map.
Steps:
1. The user zooms in or out on the map using the zoom control or mouse wheel.
Expected Result: The map zooms in or out, and markers adjust their positions and clustering dynamically.
```

---

### **Scenario 5**: Change map background

```txt
Precondition: The user is on the map page.
Steps:
1. The user clicks on the button to change the map background (satellite, plan...).
Expected Result: The map background changes according to the user's choice.
```
