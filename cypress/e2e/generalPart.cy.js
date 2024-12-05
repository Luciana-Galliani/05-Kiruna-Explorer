describe('General Part Form Tests', () => {
    const clientUrl = 'http://localhost:5173';

    beforeEach(() => {
        cy.visit(`${clientUrl}/login`);
        cy.get("input[placeholder='Enter your Username']").type('username');
        cy.get("input[placeholder='Enter your password']").type('password123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', `${clientUrl}/`);
        cy.get("a").contains("Add Document").should("exist").click();
        cy.url().should("eq", `${clientUrl}/add`);
    });
  
    it('should display validation errors for empty required fields', () => {
        cy.get('button').contains('Next').click();
  
      
        cy.contains('Please complete title, stakeholders, description, and issuance date.')
        .should('be.visible');
  
        cy.get('input[placeholder="Click to enter the title"]')
        .type('Test Document Title');

        cy.get('textarea[placeholder="Click to enter description"]')
        .type('This is a test description.');

        cy.get('input[name="issuanceYear"]').type('2024');
        cy.get('input[name="issuanceMonth"]').type('12');
        cy.get('input[name="issuanceDay"]').type('04');
      
        cy.get('input[placeholder="Click to select stakeholders"]')
        .click();

        cy.get('.modal')
        .should('be.visible');
      
        cy.get('input[type="checkbox"][value="LKAB"]')
        .check();

        cy.contains('OK').click();
  
      cy.get('button').contains('Next').click();
    });
  });
  