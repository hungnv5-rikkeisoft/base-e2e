describe(`TRUY CẬP SITE MEDIA MARKET: ${Cypress.env("mm-host")}/`, () => {
  before(() => {
    cy.loginAndSaveCookies(Cypress.env("mm-host"));
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
    `KIỂM TRA MÀN: ${Cypress.env("mm-host")}/merchant/registration/`,
    () => {
      it("FUNCTION_1 - Kiểm tra loading", () => {
        //
      });

      it("FUNCTION_2 - Kiểm tra thực hiện reload màn hình", () => {
        cy.reload();
        cy.wait(2000);
        cy.checkDataMerchantDisplay(true);
      });

      it("FUNCTION_3 - Kiểm tra back browser", () => {
        cy.go(-1);
        cy.url().should("eq", `${Cypress.env("mm-host")}/`);
      });
    }
  );
});
