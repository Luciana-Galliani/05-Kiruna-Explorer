# E2E Test Scenarios for User Story 3

## "As an **Urban Planner** I want to georeference a document (possibly at insertion time) So that I can study its relationship to the territory"

**Scenario 1**: Access document addition page

````txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
- The user clicks on "+" button.
- Expected Result: A page or form for entering the new document details is displayed.
- Can choose to modify the geo field (all municipality or a point)
- Expected Result: Document correct saved
````

**Scenario 2**: Add a document with all geo fields selected

````txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
- The user clicks on "+" button.
- Expected Result: A page or form for entering the new document details is displayed.
- Check the box 'allMunicipality' and write on 'longitude' and 'latitude'
- Expected Result: Error, need to select allMunicipality XOR 'longitude, latitude'
````
**Scenario 3**: Add a document with a single point georeference

````txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
- The user clicks on "+" button.
- The document addition form is displayed.
- The user leaves the "allMunicipality" box unchecked.
- The user enters valid coordinates in the "latitude" and "longitude" fields.
- The user completes the remaining required fields and saves the document.
Expected Result: The document is saved successfully, with its location specified by the latitude and longitude values.
````
**Scenario 4**: Attempt to add document without selecting any georeference option

````txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
- The user clicks on "Add Document".
- The document addition form is displayed.
- The user does not check the "allMunicipality" box or provide latitude and longitude coordinates.
- The user completes all other required fields and attempts to save the document.
Expected Result: An error message prompts the user to select either "allMunicipality" or specify coordinates before saving.
````
**Scenario 5**: Error when attempting to add document with invalid coordinates

````txt
Precondition: The user is logged into the system as an Urban Planner.
Steps:
- The user clicks on "+" button.
- The document addition form is displayed.
- The user leaves "allMunicipality" unchecked.
- The user enters invalid values in the "latitude" and "longitude" fields (e.g., values outside the valid range for latitude and longitude).
- The user completes the remaining required fields and tries to save the document.
Expected Result: An error message appears, indicating that the latitude and longitude values must be within the valid range (latitude: -90 to 90, longitude: -180 to 180).
````