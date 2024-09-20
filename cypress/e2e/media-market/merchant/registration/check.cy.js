import {
  LIST_FIELD_MERCHANT,
  DATA_MERCHANT_FILL,
} from "../../../../constants/merchant";
describe(`TRUY CẬP SITE MEDIA MARKET: ${Cypress.env("mm-host")}/`, () => {
  before(() => {
    cy.loginAndSaveCookies();
  });

  beforeEach(() => {
    cy.setCookieAfterLogin();
    cy.visit(`${Cypress.env("mm-host")}/`);
    cy.get(".c-unit-setting__config-icon > img").click();
    cy.contains("マーチャント設定")
      .should("have.class", "c-card-balloon__text")
      .click();
    cy.get(".c-box-check__body").click({ force: true });
    cy.visit(`${Cypress.env("mm-host")}/merchant/registration/input`);
    LIST_FIELD_MERCHANT.forEach((item) => {
      cy.getFieldMerchant(item);
    });
    cy.fillAllFieldsMerchant(DATA_MERCHANT_FILL);
    cy.get(".c-btn-common--blue").click();
  });
  it("GUI_39 - Kiểm tra back browser", () => {
    cy.go(-1);
    cy.checkFieldMerchant(DATA_MERCHANT_FILL);
  });
  it("GUI_44 - Kiểm tra reload màn hình", () => {
    cy.contains(DATA_MERCHANT_FILL.model ? "B to Cモデル" : "B to Bモデル");
  });
});
