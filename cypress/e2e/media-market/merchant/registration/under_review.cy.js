import { DATA_MERCHANT_FILL, PAYMENT_SERVICE_TEXT } from "@/constants/merchant";
describe(`TRUY CẬP SITE MEDIA MARKET: ${Cypress.env("mm-host")}/`, () => {
  let paymentService;
  before(() => {
    cy.loginAndSaveCookies();
  });

  beforeEach(() => {
    cy.setCookieAfterLogin();
    cy.visit(`${Cypress.env("mm-host")}/`);
    cy.get(".c-unit-setting__config-icon > img").click();
    cy.wait(500);
    cy.intercept("GET", "**/merchant").as("getMerchant");
    cy.contains("マーチャント設定")
      .should("have.class", "c-card-balloon__text")
      .click();
    cy.wait("@getMerchant");
  });

  context(
    `KIỂM TRA MÀN: ${Cypress.env(
      "mm-host"
    )}/merchant/registration/under-review/`,
    () => {
      it("FUNCTION_1 - Kiểm tra loading", () => {
        cy.checkDataMerchantDisplay();
      });
    }
  );
});
