describe('Georeference Part Form Tests', () => {
    const clientUrl = 'http://localhost:5173';

    beforeEach(() => {
        cy.visit(`${clientUrl}/login`);
        cy.get("input[placeholder='Enter your Username']").type('username');
        cy.get("input[placeholder='Enter your password']").type('password123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', `${clientUrl}/`);
        cy.get("a").contains("Add Document").should("exist").click();
        cy.url().should("eq", `${clientUrl}/add`);

        // from General Part to Technical Part
        cy.get('input[placeholder="Click to enter the title"]').type('Test Document');
        cy.get('textarea[placeholder="Click to enter description"]').type('Description Test');
        cy.get('input[name="issuanceYear"]').type('2024');
        cy.get('input[name="issuanceMonth"]').type('12');
        cy.get('input[name="issuanceDay"]').type('04');
        cy.get('input[placeholder="Click to select stakeholders"]').click();
        cy.get('.modal').should('be.visible');
        cy.get('input[type="checkbox"][value="LKAB"]').check();
        cy.get('.modal').find('button').contains('OK').click();
        cy.get('button').contains('Next').click();

        cy.contains('option', 'Select a type')
        .parent()
        .select('Design Document');
    
        cy.contains('option', 'Select a scale')
        .parent()
        .select('Concept');
    
        cy.get('button').contains('Next').click();
    });

    it('should display validation errors for empty required fields', () => {
        cy.get('button').contains('Next').click();
  
      
        cy.contains('Please provide either all municipality, an area, or valid coordinates.')
        .should('be.visible');
  
        cy.get('input[type="checkbox"][id="formAllMunicipality"]').check();
  
        cy.get('button').contains('Next').click();
    });

    it('should check the "All Municipality" checkbox and disable latitude/longitude', () => {
        cy.get('input[type="checkbox"][id="formAllMunicipality"]').check();
        cy.get('input[placeholder="Enter latitude"]').should('be.disabled');
        cy.get('input[placeholder="Enter longitude"]').should('be.disabled');
    });

    it('should enable latitude/longitude when "All Municipality" is not checked', () => {
        cy.get('input[type="checkbox"][id="formAllMunicipality"]').uncheck();
    
        cy.get('input[placeholder="Enter latitude"]').should('not.be.disabled');
        cy.get('input[placeholder="Enter longitude"]').should('not.be.disabled');
    });

    it('should disable "Choose on the Map" and "Draw new Area" when "All Municipality" is checked', () => {
        cy.get('input[type="checkbox"][id="formAllMunicipality"]').check();
        cy.get('button').contains('Choose on the Map').should('be.disabled');
        cy.get('button').contains('Select or draw new Area').should('be.disabled');
    });

    it('should enable "Choose on the Map" and "Draw new Area" when "All Municipality" is not checked', () => {
        cy.get('input[type="checkbox"][id="formAllMunicipality"]').uncheck();
        cy.get('button').contains('Choose on the Map').should('not.be.disabled');
        cy.get('button').contains('Select or draw new Area').should('not.be.disabled');
    });
    
    it('should set the value for latitude and longitude', () => {
        cy.get('input[type="checkbox"][id="formAllMunicipality"]').uncheck();
    
        cy.get('input[placeholder="Enter latitude"]').type('45.123');
        cy.get('input[placeholder="Enter longitude"]').type('12.456');
    
        cy.get('input[placeholder="Enter latitude"]').should('have.value', '45.123');
        cy.get('input[placeholder="Enter longitude"]').should('have.value', '12.456');
    });

    it('should allow selecting a point on the map when "Choose on the Map" button is clicked', () => {
        cy.get('input[type="checkbox"][id="formAllMunicipality"]').uncheck();
        cy.get('button').contains('Choose on the Map').should('not.be.disabled').click();
        cy.get('#map').should('be.visible');
        cy.get('#map').click(200, 200);
        cy.get('input[placeholder="Enter latitude"]').should('have.value', '67.85992551550291');
        cy.get('input[placeholder="Enter longitude"]').should('have.value', '20.199380793457028');
    });

    it('should display the "Manage Area" form when "Draw new Area" is clicked', () => {
        cy.get('input[type="checkbox"][id="formAllMunicipality"]').uncheck();
        cy.get('button').contains('Select or draw new Area').click();
        cy.get('form').contains('Manage Area').should('be.visible');
        cy.get('input[placeholder="Enter area name"]').should('exist');
        cy.get('input[placeholder="Enter area name"]').type('New Area 1');
        cy.get('input[placeholder="Enter area name"]').should('have.value', 'New Area 1');
      });

/*    it('should allow selecting an existing area in "Manage Area"', () => {
    
        cy.get('button').contains('Draw new Area').click();

        cy.get('button').contains('No Area Selected').click();

        cy.get('.span.area-name').should('contain', 'Area 1');

        cy.get('input[placeholder="Enter area name"]').should('be.disabled');
    }); */

      it('should save the area when "OK" is clicked', () => {
    
        cy.get('button').contains('Select or draw new Area').click();
    
        cy.get('input[placeholder="Enter area name"]').type('New Area2');
    
        cy.get('button').contains('OK').click();
    
        cy.get('form').contains('Manage Area').should('not.exist');
        cy.get('button').contains('New Area2').should('exist');
      });

      it('should cancel the area creation when "Cancel" is clicked', () => {
        
        cy.get('button').contains('Select or draw new Area').click();
    
        cy.get('button').contains('Cancel').click();
    
        cy.get('form').contains('Manage Area').should('not.exist');
      });
  });