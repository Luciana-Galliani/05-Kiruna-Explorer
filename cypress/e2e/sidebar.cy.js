describe('Sidebar Tests', () => {
    const clientUrl = 'http://localhost:5173';
    const docId = 1;

    beforeEach(() => {
        // Navigate to the login page
        cy.visit(`${clientUrl}/`);
    });

    it("opens the sidebar when the menu button is clicked", () => {
        
        // Check that the sidebar is not visible initially
        cy.get(".sidebar").should("have.css", "transform", "matrix(1, 0, 0, 1, -950, 0)");
        
        // Click the button to open the sidebar
        cy.get("button i.bi.bi-view-list").click();
        
        // Verify that the sidebar opens
        cy.get(".sidebar").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
    });
    
    it("closes the sidebar when the overlay is clicked", () => {
      
        cy.get("button i.bi.bi-view-list").click();
      
        cy.get(".sidebar").should("have.css", "transform", "matrix(1, 0, 0, 1, 0, 0)");
      
        // Click the overlay to close the sidebar
        cy.get(".overlay").click({ force: true }); //force because it has CSS property: position: fixed and it's being covered by another element: <td>Develop...</td>
      
        // Verify that the sidebar has been closed
        cy.get(".sidebar").should("have.css", "transform", "matrix(1, 0, 0, 1, -950, 0)");
    });
    
    it('Search a document using the title', () => {

        cy.get("button i.bi.bi-view-list").click();

        // Enter a title
        cy.get('input[placeholder="Title..."]').type('Development Plan (41)');
        cy.get('.sidebar').should('contain', 'Development Plan (41)');
    });

    it('Search a document using filters', () => {

        cy.get("button i.bi.bi-view-list").click();

        cy.get('input[placeholder="Title..."]').type('fore');
        
        // Enable detailed search
        cy.get('.bi.bi-sliders').click({force: true});
        cy.get('input[placeholder="Description"]').type('plan');
        cy.get('input[placeholder="Stakeholder"]').type('LKAB');
        cy.get('input[placeholder="Year"]').type('2014');
    });

    it('Should toggle "All Municipality" switch', () => {
        
        cy.get("button i.bi.bi-view-list").click();

        // Find the switch via the label text and activate it
        cy.contains('label', 'All Municipality')
            .prev('input[type="checkbox"]') // Find the input associated with the label
            .check()
            .should('be.checked'); // Verify that the switch is enabled

        // Disable the switch
        cy.contains('label', 'All Municipality')
            .prev('input[type="checkbox"]')
            .uncheck()
            .should('not.be.checked'); // Verify that the switch is disabled
    });

    it('Should reset filters when navigating away', () => {
        // Open the sidebar and enter values
        cy.get("button i.bi.bi-view-list").click();
        cy.get('input[placeholder="Title..."]').type('Temporary Title');

        // Change page (simulation of a path change)
        cy.visit(`${clientUrl}/login`);

        // Go back and check that the filters are reset
        cy.visit(`${clientUrl}/`);
        cy.get("button i.bi.bi-view-list").click();
        cy.get('input[placeholder="Title..."]').should('have.value', '');
    });

    it('Should display filtered documents in the table', () => {
    
        // Apply a filter
        cy.get("button i.bi.bi-view-list").click();
        cy.get('input[placeholder="Title..."]').type('Plan');
    
        // Verify that the table contains the filtered documents
        cy.get('table tbody tr').should('have.length.greaterThan', 0);
        cy.get('table tbody tr').each(($row) => {
            cy.wrap($row).should(($el) => {
              expect($el.text().toLowerCase()).to.contain('plan');
            });
          });
          
    });
    
    it('Should open details panel when a document is selected', () => {
    
        cy.get("button i.bi.bi-view-list").click();
        // Select a document from the table
        cy.get('table tbody tr').first().click();
    
        // Verify that the details panel is open
        cy.get('.details-panel-container').should('be.visible');
    });
 
    it('Should close the details panel when the close button is clicked', () => {
        
        cy.get("button i.bi.bi-view-list").click();

        // Select a document and open the panel
        cy.get('table tbody tr').first().click();
    
        // Close the panel
        cy.get('.details-panel-container button').contains('Close').click();
    
        // Check that the panel is closed
        cy.get('.details-panel-container').should('not.exist');
    }); 
    
    it('When the modify button is clicked', () => {
        cy.visit(`${clientUrl}/login`);
        cy.get("input[placeholder='Enter your Username']").type('username');
        cy.get("input[placeholder='Enter your password']").type('password123');
        cy.get('button[type="submit"]').click();

        cy.get("button i.bi.bi-view-list").click();
        cy.get('table tbody tr').first().click();
        cy.get('.details-panel-container button').contains('Modify').click();
        cy.url().should('eq', `${clientUrl}/edit/${docId}`);

    });
});