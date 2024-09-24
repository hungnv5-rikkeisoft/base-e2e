import { DATA_MERCHANT_FILL } from "@/constants/merchant";
describe(`TRUY CẬP SITE MEDIA MARKET: ${Cypress.env("mm-host")}/`, () => {
  let example;
  before(() => {
    cy.loginAndSaveCookies(Cypress.env("mm-host"));
    cy.fixture("example").then((data) => {
      example = data.merchant;
    });
  });

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.setCookieAfterLogin();
    cy.visit(`${Cypress.env("mm-host")}/`);
    cy.get(".c-unit-setting__config-icon > img").click();
    cy.wait(500);
    cy.intercept("GET", "**/merchant").as("getMerchant");
    cy.contains("マーチャント設定")
      .should("have.class", "c-card-balloon__text")
      .click();
    cy.wait("@getMerchant");
    cy.getElementMerchant("ipAddressChange");
    cy.getElementMerchant("btnIPAddress");
    cy.getElementMerchant("btnWebURL");
  });

  context(
    `KIỂM TRA MÀN: ${Cypress.env("mm-host")}/merchant/registration/check/`,
    () => {
      it("FUNCTION_1 - Kiểm tra update dữ liệu thành công", () => {
        cy.intercept("POST", "**/merchant/update").as("updateMerchant");
        const urlRandom = `day-la-url_${Math.floor(
          Math.random() * Number.MAX_SAFE_INTEGER
        )}`; // Tạo ngẫu nhiên một url để không trùng với url cũ
        cy.get("@btnWebURL").click();
        cy.getElementMerchant("webURLChange");
        cy.typing("@webURLChange", urlRandom);
        cy.get("@btnWebURL").click();
        cy.wait(200);
        cy.get("@btnWebURL").click();
        cy.get(".c-loading").should("be.visible");
        cy.wait("@updateMerchant").then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
          cy.get(".c-loading").should("not.be.visible");
          cy.get(".c-block-msg-onboard__inner--blue")
            .should("be.visible")
            .find("p.c-block-msg-onboard__text")
            .should("have.text", "情報の更新完了！");
        });
      });

      it("FUNCTION_12 - Kiểm tra thực hiện reload màn hình", () => {
        const urlRandom = `day-la-url_${Math.floor(
          Math.random() * Number.MAX_SAFE_INTEGER
        )}`; // Tạo ngẫu nhiên một url để không trùng với url cũ
        cy.get("@btnWebURL").click();
        cy.getElementMerchant("webURLChange");
        cy.typing("@webURLChange", urlRandom);
        cy.reload();
        cy.wait(300);
        cy.get("@webURLChange").should("have.value", urlRandom);
      });

      //   it.only("FUNCTION_11 - Kiểm tra back browser", () => {
      //     let textDefault;
      //     const urlRandom = `day-la-url_${Math.floor(
      //       Math.random() * Number.MAX_SAFE_INTEGER
      //     )}`; // Tạo ngẫu nhiên một url để không trùng với url cũ
      //     cy.get(".c-icon-status__text > a")
      //       .invoke("text")
      //       .then((text) => {
      //         cy.get("@btnWebURL").click();
      //         cy.getElementMerchant("webURLChange");
      //         cy.typing("@webURLChange", urlRandom);
      //         cy.get("@btnWebURL").click();
      //         cy.wait(200);
      //         cy.go(-1);
      //         cy.url().should(
      //           "eq",
      //           `${Cypress.env("mm-host")}/merchant/?edit=websiteUrl`
      //         );
      //         cy.get("@btnWebURL")
      //           .should("not.have.class", "is-error")
      //           .and("not.have.class", "is-valid")
      //           .and("have.value", text);
      //       });
      //   });
    }
  );
});
