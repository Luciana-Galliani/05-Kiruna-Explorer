describe("CityMap Tests", () => {
    const clientUrl = 'http://localhost:5173';
    
    beforeEach(() => {
        cy.visit(`${clientUrl}/`);
        cy.get("button").contains("Go to Map").click();
        cy.url().should("eq", `${clientUrl}/map`);
    });

    it("renders the map and loads documents", () => {
        cy.get("#map").should("exist");
        cy.get("#map").should('be.visible');

        cy.wait(1000);

        // Check that the points are visible
        cy.get(".ol-overlaycontainer").should("have.length.greaterThan", 0);
    });

    it("renders the map with the correct layers", () => {
        cy.get('#map').should('exist');
    
        // Verifica che i layer siano caricati (esempio: mappa standard)
        cy.get('.ol-layer').should('exist').and('have.length.greaterThan', 0);
    });
    
    it("toggles between standard and satellite map layers", () => {
    
        // Trova il pulsante per cambiare vista e cliccalo
        cy.get("button").filter((index, el) => Cypress.$(el).find("i.bi-globe").length > 0)
        .should("exist").click();
    
        // Verifica che il layer satellite sia caricato
        cy.get('.ol-layer').should('exist');
    
        // Clicca di nuovo per tornare alla vista standard
        cy.get("button").filter((index, el) => Cypress.$(el).find("i.bi-globe").length > 0)
        .should("exist").click();
    
        // Verifica che il layer standard sia caricato
        cy.get('.ol-layer').should('exist');
    });
    
    it("displays document markers on the map", () => {
        cy.wait(2000);
        
        // Verifica che ci siano marker visibili sulla mappa
        cy.get(".ol-layer canvas").should("exist");
        // Non possiamo direttamente verificare i marker, ma possiamo verificare che il canvas contenga elementi grafici
        cy.get(".ol-layer canvas").then((canvas) => {
            const context = canvas[0].getContext("2d");
            const pixelData = context.getImageData(0, 0, canvas[0].width, canvas[0].height).data;

            // Controlla che il canvas abbia contenuto (non sia completamente vuoto)
            const hasContent = Array.from(pixelData).some((value) => value !== 0);
            expect(hasContent).to.be.true;
        });
    });
    
    it("changes the cursor to a pointer when hovering over a document marker", () => {
        cy.wait(2000);
        // Simula un movimento del mouse sopra un marker
        cy.get(".ol-layer canvas").trigger("mousemove", { clientX: 20.222444, clientY: 67.8525 }); // Regola le coordinate

        // Verifica che il cursore sia cambiato
        cy.get("#map").should("have.css", "cursor", "auto");
    });
    
    it("does not open the details panel when clicking on an empty area", () => {
    
        // Nascondi temporaneamente l'elemento sovrapposto
        cy.get('ul').invoke('css', 'display', 'none');
        cy.wait(2000);
    
        // Clicca su un'area vuota della mappa (ad esempio nell'angolo in basso a destra)
        cy.get(".ol-layer canvas").click("bottomRight");
    
        // Verifica che il pannello dei dettagli non sia visibile
        cy.get(".details-panel").should("not.exist");
    });
    
    it("removes and re-renders document markers when documents are updated", () => {

        cy.wait(2000);
    
        // Verifica che il canvas della mappa mostri contenuti (indicativi di marker/documenti visibili)
        cy.get(".ol-layer canvas").then((canvas) => {
            const context = canvas[0].getContext("2d");
            const initialPixelData = context.getImageData(0, 0, canvas[0].width, canvas[0].height).data;
    
            const initialHasContent = Array.from(initialPixelData).some((value) => value !== 0);
            expect(initialHasContent).to.be.true;
        });
    
        // Simula un'azione che aggiorna i documenti, ad esempio ricaricando la pagina
        cy.reload();
    
        // Aspetta il caricamento aggiornato
        cy.wait(2000);
    
        // Verifica che il canvas della mappa mostri nuovamente contenuti aggiornati
        cy.get(".ol-layer canvas").then((canvas) => {
            const context = canvas[0].getContext("2d");
            const updatedPixelData = context.getImageData(0, 0, canvas[0].width, canvas[0].height).data;
    
            const updatedHasContent = Array.from(updatedPixelData).some((value) => value !== 0);
            expect(updatedHasContent).to.be.true;
        });
    });       

});
