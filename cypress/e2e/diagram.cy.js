describe("DiagramPage Tests", () => {
    const clientUrl = 'http://localhost:5173';
    
    beforeEach(() => {
        cy.visit(`${clientUrl}/`);
        cy.get("button").contains("Go to Diagram").click();
        cy.url().should("eq", `${clientUrl}/diagram`);
    });

    it('should render the diagram and the legend', () => {
        // Verify that the diagram is present
        cy.get('.diagram-container').should('exist').and('be.visible');
      
        // Verify that the legend is present
        cy.get('.legend').should('exist').and('be.visible');
    });

    it('should expand the legend on hover and collapse when the mouse leaves', () => {
        // Check that the legend is initially collapsed
        cy.get('.legend').should('have.class', 'collapsed');
      
        // Hover over the legend
        cy.get('.legend').click();
      
        // Verify that the legend is expanded
        cy.get('.legend').should('have.class', 'expanded');
      
        // Move the mouse out of the legend
        cy.get('.diagram-container').click();
      
        // Verify that the legend returns collapsed
        cy.get('.legend').should('have.class', 'collapsed');
    });
      
    it('should allow zooming on the diagram', () => {
        // Simulates a zoom on the diagram
        cy.get('svg').trigger('wheel', { deltaY: -100 }); // Zoom in
        cy.get('svg').trigger('wheel', { deltaY: 100 }); // Zoom out
    });
      
    it('should display a tooltip when hovering over a node', () => {
        // Find and hover over a node
        cy.get('svg .node').first().scrollIntoView()
        .should('be.visible')
        .trigger('mouseover', { force: true });
    
        // Verify that the title tooltip is visible
        cy.get('.titleTooltip').should('exist').and('be.visible');
      
        // Move the mouse out of the node
        cy.get('svg .node').first().trigger('mouseout', { force: true });
      
        // Verify that the tooltip is hidden
        cy.get('.titleTooltip').should('not.be.visible');
    });
      
    it('should open the DetailsPanel modal when clicking a node', () => {
        // Find and click on a node
        cy.get('svg .node').first().scrollIntoView()
        .should('be.visible')
        .click({ force: true });
      
        // Verify that the modal is visible
        cy.get('.modal').should('exist').and('be.visible');
      
        cy.get('.modal button').contains('Close').click();
      
        cy.get('.modal').should('not.exist');
    });
       
    it('should display a tooltip when hovering over a link', () => {
        // Find and hover over a link
        cy.get('svg .link-hitbox').first().scrollIntoView()
        .should('be.visible')
        .trigger('mouseover', { force: true });
      
        // Verify that the link tooltip is visible
        cy.get('.linkTooltip').should('exist').and('be.visible');
      
        // Move the mouse out of the link
        cy.get('svg .link-hitbox').first().trigger('mouseout', { force: true });
      
        // Verify that the tooltip is hidden
        cy.get('.linkTooltip').should('not.be.visible');
    });
      
    it('should highlight overlapping links when hovering over a link', () => {
        
        cy.get('svg .link-hitbox').first().scrollIntoView()
        .should('be.visible')
        .trigger('mouseover', { force: true });
      
        // Verify that overlapping links are highlighted
        cy.get('svg .link').filter(':visible').should('have.attr', 'stroke', 'white');
      
        cy.get('svg .link-hitbox').first().trigger('mouseout', { force: true });
      
        // Verify that links return to original color
        cy.get('svg .link').filter(':visible').should('have.attr', 'stroke', 'black');
    });
     
    it('should resize the diagram when the window is resized', () => {
        // Simulates a resizing of the window
        cy.viewport(800, 600);
      
        // Check that the dimensions of the diagram have changed
        cy.get('svg')
            .invoke('attr', 'width')
            .then((width) => {
            expect(Number(width)).to.be.greaterThan(0);
        });

        cy.get('svg')
            .invoke('attr', 'height')
            .then((height) => {
                expect(Number(height)).to.be.greaterThan(0);
        });
    });     

});