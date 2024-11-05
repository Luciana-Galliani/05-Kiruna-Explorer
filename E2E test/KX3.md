# E2E Test Scenarios for User Story 3

## "As an **Urban Planner** I want to georeference a document (possibly at insertion time) So that I can study its relationship to the territory"

**Scenario 1**: Access document addition page

````txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
- The user clicks on "Add Document".
- Expected Result: A page or form for entering the new document details is displayed.
- Can choose to modify the geo field (all municipality or a point)
- Expected Result: Document correct saved
````

**Scenario 2**: Add a document with all geo fields selected

````txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
- The user clicks on "Add Document".
- Expected Result: A page or form for entering the new document details is displayed.
- Check the box 'allMunicipality' and write on 'longitude' and 'latitude'
- Expected Result: Error, need to select allMunicipality XOR 'longitude, latitude'
````