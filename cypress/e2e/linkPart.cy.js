describe('Link Part Form Tests', () => {
    const clientUrl = 'http://localhost:5173';

    beforeEach(() => {
        cy.visit(`${clientUrl}/login`);
        cy.get("input[placeholder='Enter your Username']").type('username');
        cy.get("input[placeholder='Enter your password']").type('password123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', `${clientUrl}/map`);
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
        cy.get('input[type="checkbox"][id="formAllMunicipality"]').check();
        cy.get('button').contains('Next').click();
    });

      
      
    it('should show document options in the dropdown and select a document', () => {
        
        cy.get('button[id="dropdown-basic-button"]').click();
        cy.get('.dropdown-menu').contains('Development Plan (41)').click();
    
        cy.get('button[id="dropdown-basic-button"]').should('contain', 'Development Plan (41)');
    });
    
/*    it('should enable and disable the "Type Of Connection" field based on document selection', () => {
        cy.get('button[id="dropdown-basic-button"]').click();
        cy.get('.dropdown-menu').contains('Development Plan (41)').click();
    
        // Verifica che il campo "Type Of Connection" sia abilitato
        cy.get('select').should('not.be.disabled');
    
        // Deseleziona il documento
        cy.get('button[id="dropdown-basic-button"]').click();
        cy.get('.dropdown-menu').contains('Select a document').click();
        cy.get('select').should('be.disabled');
    }); */
    
    it('should add a connection when a document and relationship are selected', () => {
        cy.get('button[id="dropdown-basic-button"]').click();
        cy.get('.dropdown-menu').contains('Development Plan (41)').click();
    
        cy.get('select').select('Prevision');
    
        cy.get('button').contains('Add Connection').should('not.be.disabled');
    
        cy.get('button').contains('Add Connection').click();
    
        // Check
        cy.get('.connections').should('contain', 'Document: Development Plan (41)');
        cy.get('.connections').should('contain', 'Type: Prevision');
    });
    
    it('should not add a connection if no document or relationship is selected', () => {
        cy.get('button').contains('Add Connection').should('be.disabled');
    });
    
    it('should save the form when save button is clicked', () => {
        cy.get('button').contains('Save').click();
        cy.url().should("eq", `${clientUrl}/`);
    });
    
});
