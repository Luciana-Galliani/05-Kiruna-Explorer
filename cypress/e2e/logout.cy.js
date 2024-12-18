describe('Logout Tests', () => {
  const clientUrl = 'http://localhost:5173';

  beforeEach(() => {
    // Login before testing logout
    cy.visit(`${clientUrl}/login`);
    cy.get("input[placeholder='Enter your Username']").type('username');
    cy.get("input[placeholder='Enter your password']").type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', `${clientUrl}/map`);
  });

  it('Logout successfully when confirmed', () => {
    cy.contains("button", "Logout").click();
    cy.get(".modal").should("be.visible");
    // Click "Yes" to confirm logout
    cy.get(".modal .btn-primary").click();
    cy.url().should("eq", `${clientUrl}/login`);
  });

  it('Change your mind and don\'t log out', () => {
    cy.contains("button", "Logout").click();
    cy.get(".modal").should("be.visible");
    // Click "No" to annul logout
    cy.get(".modal .btn-secondary").click();
    cy.url().should("eq", `${clientUrl}/map`);
  });
});
  