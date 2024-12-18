describe('Technical Part Form Tests', () => {
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
    });
  
    it('should validate required fields in Technical Part', () => {
      cy.get('button').contains('Next').click();
  
      cy.contains('Please complete type and scale.').should('be.visible');
  
      cy.contains('option', 'Select a type')
      .parent()
      .select('Design Document');
  
      cy.contains('option', 'Select a scale')
      .parent()
      .select('Concept');
  
      cy.get('button').contains('Next').click();
    });
  
    it('should handle "Other" type selection', () => {
        cy.contains('option', 'Select a type')
        .parent()
        .select('Other');
  
        cy.get('input[placeholder="Enter a new document type"]').should('be.visible');
  
        cy.get('input[placeholder="Enter a new document type"]').type('Custom Type');
    });
  
    it('should handle "Plan" scale selection', () => {
    
        cy.contains('option', 'Select a scale')
        .parent()
        .select('Plan');

      cy.get('input[placeholder="Plan scale (e.g. 1:1,000)"]').should('be.visible');
  
      cy.get('input[placeholder="Plan scale (e.g. 1:1,000)"]').type('1:500');
    });
  
    it('should allow adding and removing files', () => {
        // Add file
        const fileName = 'example.pdf';
        cy.get('input[type="file"]').selectFile('cypress/fixtures/' + fileName, { force: true });
    
        cy.contains(fileName).should('be.visible');
    
        // Delete file
        cy.contains(fileName)
            .parent()
            .find('button')
            .click();
    
        cy.contains(fileName).should('not.exist');
    });
  
    it('should fill optional fields', () => {
      
      cy.get('input[placeholder="Click to enter language"]').type('English');
  
      cy.get('input[placeholder="Enter number of pages"]').type('12-34');
  
      cy.get('input[placeholder="Click to enter language"]').should('have.value', 'English');
      cy.get('input[placeholder="Enter number of pages"]').should('have.value', '12-34');
    });
  });