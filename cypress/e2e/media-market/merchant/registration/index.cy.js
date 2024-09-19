describe(`TRUY CẬP SITE MEDIA MARKET: ${Cypress.env("mm-host")}/`, () => {
  before(() => {
    cy.loginAndSaveCookies();
  });

  beforeEach(() => {
    cy.setCookieAfterLogin();
    cy.visit(`${Cypress.env("mm-host")}/merchant/registration/`);
    cy.wait(5000);
  });

  context(
    `KIỂM TRA MÀN: ${Cypress.env("mm-host")}/merchant/registration/index`,
    () => {
      it("GUI_23 - Kiểm tra back browser", () => {
        cy.visit(`${Cypress.env("mm-host")}/`);
        cy.wait(5000);
        cy.visit(`${Cypress.env("mm-host")}/merchant/registration/`);
        cy.go(-1);
        cy.url().should("eq", `${Cypress.env("mm-host")}/`);
      });
      it("GUI_24 - Kiểm tra back browser", () => {
        cy.visit(`${Cypress.env("mm-host")}/`);
        cy.get(".c-unit-setting__config-icon > img").click();
        cy.contains("マーチャント設定")
          .should("have.class", "c-card-balloon__text")
          .click();
        cy.url().should(
          "eq",
          `${Cypress.env("mm-host")}/merchant/registration/`
        );
        cy.go(-1);
        cy.url().should("eq", `${Cypress.env("mm-host")}/`);
      });
      it("GUI_26 - Kiểm tra reload màn hình", () => {
        cy.get(".c-box-check__body").should("not.have.class", "is-valid");
        cy.reload();
        cy.get(".c-box-check__body").should("not.have.class", "is-valid");
      });
      it("GUI_27 - Kiểm tra reload màn hình", () => {
        cy.get(".c-box-check__body").click();
        cy.get(".c-box-check__body").should("have.class", "is-valid");
        cy.reload();
        cy.get(".c-box-check__body").should("have.class", "is-valid");
      });
    }
  );
});
