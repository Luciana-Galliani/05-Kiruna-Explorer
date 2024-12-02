describe('Sidebar Tests', () => {
    const clientUrl = 'http://localhost:5173';

    beforeEach(() => {
        // Navigate to the login page
        cy.visit(`${clientUrl}/`);
    });

    it("opens the sidebar when the menu button is clicked", () => {
        
        // Check that the sidebar is not visible initially
        cy.get(".sidebar").should("not.have.class", "open");
        
        // Click the ☰ button to open the sidebar
        cy.get("button").contains("☰").click();
        
        // Verify that the sidebar opens
        cy.get(".sidebar").should("have.class", "open");
    });
    
    it("closes the sidebar when the overlay is clicked", () => {
      
        cy.get("button").contains("☰").click();
      
        cy.get(".sidebar").should("have.class", "open");
      
        // Click the overlay to close the sidebar
        cy.get(".overlay").click();
      
        // Verify that the sidebar has been closed
        cy.get(".sidebar").should("not.have.class", "open");
    });
    
    it("navigates to the correct page when a sidebar link is clicked", () => {
    
        cy.get("button").contains("☰").click();
      
        // Verify that the "Municipal Documents" link exists
        cy.get(".sidebar").contains("Municipal Documents").click();
      
        // Verify that the user is redirected to the "/municipality" page
        cy.url().should("eq", `${clientUrl}/municipality`);
      
        // Open the sidebar again to test the second link
        cy.get("button").contains("☰").click();
      
        // Verify that the "All documents" link exists
        cy.get(".sidebar").contains("All documents").click();
      
        // Verify that the user is redirected to the "/allDocuments" page
        cy.url().should("eq", `${clientUrl}/allDocuments`);
    });
    
    it("closes the sidebar when a link inside it is clicked", () => {
    
        cy.get("button").contains("☰").click();
      
        cy.get(".sidebar").should("have.class", "open");
      
        // Click on a link within the sidebar
        cy.get(".sidebar").contains("Municipal Documents").click();
      
        // Check that the sidebar has been closed (the 'open' class is no longer present)
        cy.get(".sidebar").should("not.have.class", "open");
      
        // Verify that the user was redirected to the correct page
        cy.url().should("eq", "http://localhost:5173/municipality");
    });
      
});