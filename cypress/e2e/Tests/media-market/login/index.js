import LoginPage from "@Pages/media-market/login";
import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
const loginPage = new LoginPage();

Given("I am on the {string} page", () => {
  loginPage.visit();
});

Then("I should see a {string} as {string}", (title, value) => {
  loginPage.elements[title]().should("contain.text", value);
});

Then(
  "I should see a {string} with default value {string}",
  (input, defaultValue) => {
    loginPage.elements[input]()
      .should("be.visible")
      .should("have.value", defaultValue);
  },
);

When("I enter {string} in the {string} element", (value, input) => {
  loginPage.elements[input]().type(value).blur();
});

When("I click on the {string} button", () => {
  cy.wait(1000);
  loginPage.submit();
});

Then("I should redirect to dashboard page", () => {});
Then("I should see error message {string}", () => {});
