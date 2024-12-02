describe('Footer Tests', () => {
    const clientUrl = 'http://localhost:5173';

    beforeEach(() => {
        // Login before testing logout
        cy.visit(`${clientUrl}/login`);
        cy.get("input[placeholder='Enter your Username']").type('username');
        cy.get("input[placeholder='Enter your password']").type('password123');
        cy.get('button[type="submit"]').click();
        cy.url().should('eq', `${clientUrl}/`);
    });

  /*  beforeEach(() => {
        cy.task("checkOrRegisterAndLogin", {
            username: "username",        // Enter the username    
            password: "password123",     // Enter your password
        }).then(() => {
            // Once logged in, visit the home page
            cy.visit(clientUrl);
        });
    }); */
      

    it("renders 'Add Document' and 'Satellite View' buttons on the homepage for logged-in users", () => {
      
        // Check the presence of the buttons
        cy.get("a").contains("Add Document").should("exist");
        cy.get("button").filter((index, el) => Cypress.$(el).find("i.bi-globe").length > 0)
        .should("exist");
    });

    it("renders a close button on the 'Add' page", () => {

        cy.get("a").contains("Add Document").should("exist").click();
        cy.url().should("eq", `${clientUrl}/add`);
        cy.get("button .bi-x").should("exist");
    });
      
    it("navigates back to the homepage when the close button is clicked on specific pages", () => {
        // Check on the "All Documents" page
        cy.visit(`${clientUrl}/allDocuments`);
        cy.get("button").find(".bi-x").click();
        cy.url().should("eq", `${clientUrl}/`);
      
        // Check on the "Municipality" page
        cy.visit(`${clientUrl}/municipality`);
        cy.get("button").find(".bi-x").click();
        cy.url().should("eq", `${clientUrl}/`);
    });
      
    it("renders the 'Satellite View' button for non-logged-in users", () => {
        // Visit the homepage as a not-logged in user
        cy.contains("button", "Logout").click();
        cy.get(".modal").should("be.visible");
        // Click "Yes" to confirm logout
        cy.get(".modal .btn-primary").click();
        cy.url().should("eq", `${clientUrl}/login`);
      
        // Check for the "Satellite View" button
        cy.get("button").filter((index, el) => Cypress.$(el).find("i.bi-globe").length > 0)
        .should("exist");
    });
      
    it("displays a confirmation modal when trying to close the form on 'Add' page", () => {
        
        cy.get("a").contains("Add Document").should("exist").click();
        cy.url().should("eq", `${clientUrl}/add`);

        cy.get("button .bi-x").should("exist").click();

        cy.get(".modal").should("exist");
        cy.get(".modal").contains("Are you sure you want to close the form? Your changes will be lost.").should("exist");
      
        // Close the modal without navigating
        cy.get(".modal").contains("No").click();
        cy.url().should("eq", `${clientUrl}/add`);
      
        // Confirm the closure
        cy.get("button .bi-x").should("exist").click();
        cy.get(".modal").contains("Yes").click();
        cy.url().should("eq", `${clientUrl}/`);
    });
      
});