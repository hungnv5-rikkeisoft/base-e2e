import { notFullwidthOrSpaceRegex } from "@/support/validator";
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
    `KIỂM TRA MÀN: ${Cypress.env("mm-host")}/merchant/registration/input/`,
    () => {
      context("GUI", () => {
        context("Kiểm tra textbox アクセスIP制限 (*)", () => {
          it("GUI_6 - Kiểm tra bắt buộc nhập", () => {
            cy.get("@btnIPAddress").click();
            cy.typing("@ipAddressChange");
            cy.get("@ipAddressChange")
              .should("not.have.class", "is-error")
              .and("have.value", "");
            cy.checkToolTipValidate(false);
          });
          it("GUI_7 - Kiểm tra nhập liệu hợp lệ", () => {
            cy.get("@btnIPAddress").click();
            cy.get("@ipAddressChange").should(
              "have.value",
              DATA_MERCHANT_FILL.ipAddress
            );
            example.ip_address.valid.forEach((val) => {
              cy.typing("@ipAddressChange", val)
                .should("have.class", "is-valid")
                .then(($el) => {
                  const text = $el.text();
                  expect(text).to.match(notFullwidthOrSpaceRegex);
                });
              cy.checkToolTipValidate(false);
              cy.checkButtonConfirm(true);
            });
          });
          it("GUI_8 - Kiểm tra nhập dữ liệu không hợp lệ", () => {
            // Tất cả case hiển thị message "IPアドレスを正しく入力してください。" đều check ở đây
            cy.get("@btnIPAddress").click();
            example.ip_address.in_valid.forEach((val) => {
              cy.typing("@ipAddressChange", val).should(
                "have.class",
                "is-error"
              );
              cy.wait(1000);
              cy.checkToolTipValidate(
                true,
                "IPアドレスを正しく入力してください。",
                ".c-input-common__tooltip-item"
              );
              cy.checkButtonConfirm(false);
            });
          });
          it("GUI_44 - Kiểm tra max length", () => {
            cy.get("@btnIPAddress").click();
            const textMaxLength = "192.168.1.1, ".repeat(22).slice(0, -2);
            cy.log(`Đã nhâp ${textMaxLength.length} kí tự`);
            cy.typing("@ipAddressChange", textMaxLength).should(
              "have.class",
              "is-valid"
            );
            cy.checkToolTipValidate(false);
          });
          it("GUI_53 - Kiểm tra mức độ ưu tiên của các loại message validate", () => {
            // Do ô input này chỉ có 1 message check data không hợp lệ nên bỏ qua case này
          });
        });

        context("Kiểm tra trường WEBサイトURL (*) ", () => {
          it("GUI_41 - Kiểm tra label", () => {
            cy.get(
              ".c-table-box__inner--start-mobile > .c-table-box__head > .c-table-box__title"
            ).as("Web");
            cy.should("have.text", "WEBサイトURL (*)");
          });
          it("GUI_5 - Kiểm tra bắt buộc nhập", () => {
            cy.get("@btnWebURL").click();
            cy.getElementMerchant("webURLChange");
            cy.typing("@webURLChange");
            cy.get("@webURLChange")
              .should("not.have.class", "is-error")
              .and("have.value", "");
            cy.checkToolTipValidate(false);
          });
          it("GUI_6 - Kiểm tra nhập liệu hợp lệ", () => {
            cy.get("@btnWebURL").click();
            cy.getElementMerchant("webURLChange");
            cy.get("@webURLChange").should(
              "have.value",
              DATA_MERCHANT_FILL.webURL
            );
            example.web_url.valid.forEach((val) => {
              cy.typing("@webURLChange", val)
                .should("have.class", "is-valid")
                .then(($el) => {
                  const text = $el.text();
                  expect(text).to.match(notFullwidthOrSpaceRegex);
                });
              cy.checkToolTipValidate(false);
              cy.checkButtonConfirm(true);
            });
          });
          it("GUI_7 - Kiểm tra nhập dữ liệu không hợp lệ", () => {
            cy.get("@btnWebURL").click();
            cy.getElementMerchant("webURLChange");
            example.web_url.in_valid.forEach((val) => {
              cy.typing("@webURLChange", val).should("have.class", "is-error");
              cy.checkToolTipValidate(
                true,
                "WEBサイトURLは半角英字、半角数字、半角記号で入力してください。"
              );
              cy.checkButtonConfirm(false);
            });
          });

          it("GUI_8 - Nhập từ bàn phím tiếng Nhật", () => {
            //Check ở GUI_44 - trường hợp nhập fullwidth
          });

          it("GUI_9 - Kiểm tra max length.Nhập > 255 kí tự", () => {
            const longText = "a".repeat(256);
            cy.get("@btnWebURL").click();
            cy.getElementMerchant("webURLChange");
            cy.typing("@webURLChange", longText).should(
              "have.class",
              "is-error"
            );
            cy.checkToolTipValidate(
              true,
              "WEBサイトURLは255文字以内で入力してください。"
            );
            cy.checkButtonConfirm(false);
          });

          it("GUI_10 - Kiểm tra max length.Nhập = 255 kí tự", () => {
            const longText = "b".repeat(255);
            cy.get("@btnWebURL").click();
            cy.getElementMerchant("webURLChange");
            cy.typing("@webURLChange", longText)
              .should("have.class", "is-valid")
              .and("have.value", longText);
            cy.checkToolTipValidate(false);
            cy.checkButtonConfirm(true);
          });

          it("GUI_11 - Kiểm tra max length.Nhập < 255 kí tự", () => {
            const longText = "c".repeat(254);
            cy.get("@btnWebURL").click();
            cy.getElementMerchant("webURLChange");
            cy.typing("@webURLChange", longText)
              .should("have.class", "is-valid")
              .and("have.value", longText);
            cy.checkToolTipValidate(false);
            cy.checkButtonConfirm(true);
          });

          it("GUI_12 - Kiểm tra copy, paste dữ liệu", () => {
            const dataToPaste = "This is a data to paste";
            cy.get("@btnWebURL").click();
            cy.getElementMerchant("webURLChange");
            cy.get("@webURLChange")
              .focus()
              .clear()
              .invoke("val", dataToPaste)
              .should("have.value", dataToPaste);
          });

          it("GUI_13 + 14 - Kiểm tra trim space", () => {
            cy.get("@btnWebURL").click();
            cy.getElementMerchant("webURLChange");
            cy.typing("@webURLChange", "  test space dau　cuoi  ").should(
              "have.value",
              "testspacedaucuoi"
            );
          });

          it("GUI_15 - Kiểm tra mức độ ưu tiên của các loại message validate", () => {
            const data = [
              {
                text: "😀".repeat(256),
                message: "WEBサイトURLは255文字以内で入力してください。",
              },
              {
                text: "😀😀😀😀",
                message:
                  "WEBサイトURLは半角英字、半角数字、半角記号で入力してください。",
              },
            ];
            cy.get("@btnWebURL").click();
            cy.getElementMerchant("webURLChange");
            data.forEach((item) => {
              cy.typing("@webURLChange", item.text).should(
                "have.class",
                "is-error"
              );

              cy.checkToolTipValidate(true, item.message);
              cy.checkButtonConfirm(false);
            });
          });
        });
      });
      context("FUNCTION", () => {
        context("Kiểm tra thực hiện reload màn hình", () => {
          it("FUNCTION_0 - Trường hợp chưa nhập liệu", () => {
            cy.reload();
            cy.checkDataMerchantDisplay(true);
          });
          it("FUNCTION_1 - Trường hợp đã nhập liệu KHÔNG HỢP LỆ", () => {
            cy.get("@btnIPAddress").click();
            cy.typing("@ipAddressChange", "11111111").should(
              "have.class",
              "is-error"
            );
            cy.checkToolTipValidate(
              true,
              "IPアドレスを正しく入力してください。",
              ".c-input-common__tooltip-item"
            );
            cy.checkButtonConfirm(false);

            cy.reload();
            cy.get("@ipAddressChange")
              .should("have.class", "is-error")
              .and("have.value", "11111111");
            cy.checkToolTipValidate(
              true,
              "IPアドレスを正しく入力してください。",
              ".c-input-common__tooltip-item"
            );
            cy.checkButtonConfirm(false);
          });
          it("FUNCTION_2 - Trường hợp đã nhập liệu HỢP LỆ", () => {
            cy.get("@btnIPAddress").click();
            cy.typing("@ipAddressChange", "192.168.1.3").should(
              "have.class",
              "is-valid"
            );
            cy.checkToolTipValidate(false);
            cy.checkButtonConfirm(true);

            cy.reload();
            cy.get("@ipAddressChange")
              .should("have.class", "is-valid")
              .and("have.value", "192.168.1.3");
            cy.checkToolTipValidate(false);
            cy.checkButtonConfirm(true);
          });
        });
        it("FUNCTION_3 - Kiểm tra back browser", () => {
          cy.get("@btnIPAddress").click();
          cy.typing("@ipAddressChange", "192.168.1.3").should(
            "have.class",
            "is-valid"
          );
          cy.go(-1);
          cy.url().should("eq", `${Cypress.env("mm-host")}/merchant/`);
          cy.checkDataMerchantDisplay(true);
        });
      });
    }
  );
});
