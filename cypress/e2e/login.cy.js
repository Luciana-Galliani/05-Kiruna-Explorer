describe('Login Page Tests', () => {
  const clientUrl = 'http://localhost:5173';

  beforeEach(() => {
    // Navigate to the login page
    cy.visit(`${clientUrl}/login`);
  });

  it('Displays the login form correctly', () => {
    cy.get("form").should('be.visible');
    cy.get("input[placeholder='Enter your Username']").should('exist');
    cy.get("input[placeholder='Enter your password']").should('exist');
    cy.get("button[type=submit]").contains("Login").should("exist").should('be.disabled');
    cy.get("a").contains("Cancel").should("exist");
  });

  it('should not allow submission with empty fields', () => {
    cy.get('button[type="submit"]').should('be.disabled');

    // Ensures the URL remains the same
    cy.url().should('eq', `${clientUrl}/login`);
  });

  it('Login successfully with valid credentials', () => {

    cy.get("input[placeholder='Enter your Username']").type('username');
    cy.get("input[placeholder='Enter your password']").type('password123');

    cy.get("button[type=submit]").should("not.be.disabled");
    cy.get("button[type=submit]").click();

    cy.wait(1000);
    
    cy.url().should('eq', `${clientUrl}/`); //Check the redirect to the homepage
  });

  it('Shows error message for invalid credentials', () => {
    cy.get("input[placeholder='Enter your Username']").type('wronguser');
    cy.get("input[placeholder='Enter your password']").type('wrongpassword');

    cy.get("button[type=submit]").should("not.be.disabled");
    cy.get("button[type=submit]").click();

    cy.wait(1000);
    
    cy.get('.alert.alert-danger').should('be.visible').and('contain', 'Login failed, check your credentials');
  });

  it("Redirects to home page on cancel", () => {
    cy.get("a").contains("Cancel").click();
    cy.url().should("eq", `${clientUrl}/`);
  });

  it("Redirects to registration form page", () => {
    cy.get("a").contains("Register here").click();
    cy.url().should("eq", `${clientUrl}/registration`);
  });
});