describe("Registration Form Tests", () => {
    beforeEach(() => {
      // Navigate to the registration form page
      cy.visit("http://localhost:5173/registration");
    });
  
    it("Displays the registration form correctly", () => {
      cy.get("form").should("be.visible");
      cy.get("input[placeholder='Enter your username']").should("exist");
      cy.get("input[placeholder='Enter your password']").should("exist");
      cy.get("input[placeholder='Confirm your password']").should("exist");
      cy.get("button[type=submit]").contains("Register").should("exist");
      cy.get("a").contains("Cancel").should("exist");
    });
  
    it("behavior of the register button in case the passwords do not match and then yes", () => {
      cy.get("input[placeholder='Enter your username']").type("testuser");
      cy.get("input[placeholder='Enter your password']").type("password123");
      cy.get("input[placeholder='Confirm your password']").type("differentPassword");
      cy.get("button[type=submit]").should("be.disabled");
      
      // Correct the fields to enable the button
      cy.get("input[placeholder='Confirm your password']").clear().type("password123");
      cy.get("button[type=submit]").should("not.be.disabled");
    });
  
    it("Disables the register button when required fields are empty", () => {
      cy.get("button[type=submit]").should("be.disabled");
    });
  
    it("Disables the register button when passwords do not match", () => {
      cy.get("input[placeholder='Enter your username']").type("testuser");
      cy.get("input[placeholder='Enter your password']").type("password123");
      cy.get("input[placeholder='Confirm your password']").type("differentPassword");
  
      cy.get("button[type=submit]").should("be.disabled");
    });
  
    it("Registers successfully with valid inputs", () => {
      cy.get("input[placeholder='Enter your username']").type("username");
      cy.get("input[placeholder='Enter your password']").type("password123");
      cy.get("input[placeholder='Confirm your password']").type("password123");
  
      cy.get("button[type=submit]").should("not.be.disabled");
      cy.get("button[type=submit]").click();
  
      // Verify that the response was received and the user registered
      cy.wait(1000); // Wait a while for registration to complete

      // Verify that the user is logged in successfully and that the token is stored
      cy.url().should("eq", "http://localhost:5173/");
      cy.window().its("localStorage.authToken").should("exist"); // Verifica che il token di autenticazione sia presente nel localStorage
    });
  
    it("Shows error message when registration fails", () => {
        cy.get("input[placeholder='Enter your username']").type("username");
        cy.get("input[placeholder='Enter your password']").type("password123");
        cy.get("input[placeholder='Confirm your password']").type("password123");
      
        cy.get("button[type=submit]").should("not.be.disabled");
        cy.get("button[type=submit]").click();
      
        // Verify that an error message is shown
        cy.get(".alert.alert-danger").should("contain", "Username already exists");
    });
      
    it("Redirects to home page on cancel", () => {
      cy.get("a").contains("Cancel").click();
      cy.url().should("eq", "http://localhost:5173/");
    });
  });  