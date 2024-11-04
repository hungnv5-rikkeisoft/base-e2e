class LoginPage {
  // elements
  get elements() {
    return {
      Form: () => cy.get(".column__inner-box--flex"),
      Title: () => cy.contains("Login to Account"),
      Email: () => cy.get("input[type=text]"),
      Password: () => cy.get("input[type=password]"),
      LoginButton: () => this.elements.Form().contains("Login"),
    };
  }

  // method
  visit() {
    cy.visit(`${Cypress.env("mm-host")}/`, { failOnStatusCode: false });
  }

  isLoginPage() {
    cy.location("pathname").should("contain", "login");
  }

  submit() {
    this.elements.LoginButton().click();
  }
}
export default LoginPage;
