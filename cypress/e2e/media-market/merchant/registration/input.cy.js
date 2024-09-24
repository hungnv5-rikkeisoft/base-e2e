import { notFullwidthOrSpaceRegex } from "@/support/validator";
import {
  LIST_FIELD_MERCHANT,
  DATA_MERCHANT_FILL,
  PAYMENT_SERVICE_TEXT,
} from "@/constants/merchant";

describe(`TRUY CẬP SITE MEDIA MARKET: ${Cypress.env("mm-host")}/`, () => {
  let example;
  let paymentService;
  before(() => {
    cy.loginAndSaveCookies(Cypress.env("mm-host"));
    cy.fixture("example").then((data) => {
      example = data.merchant;
    });
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
    // cy.get("label.c-box-check__body").scrollIntoView().click({ force: true });
    cy.visit(`${Cypress.env("mm-host")}/merchant/registration/input`);
    LIST_FIELD_MERCHANT.forEach((item) => {
      cy.getFieldMerchant(item);
    });
  });
  context(
    `KIỂM TRA MÀN: ${Cypress.env("mm-host")}/merchant/registration/input`,
    () => {
      it("GUI_16 - Kiểm tra check qua lại giữa 2 checkbox", () => {
        cy.get("@B_to_C").click({ force: true });
        cy.get("@B_to_C").should("have.class", "is-active");
        cy.get("@B_to_B").should("have.class", "is-inactive");
        cy.get("@B_to_B").click({ force: true });
        cy.get("@B_to_B").should("have.class", "is-active");
        cy.get("@B_to_C").should("have.class", "is-inactive");
      });
      it("GUI_21 - Kiểm tra chọn giá trị ở pulldown", () => {
        cy.get("@industry").click({ force: true });
        cy.contains("li", "鉱業・採石業・砂利採取業").should("exist").click();
        cy.get("@industry")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("鉱業・採石業・砂利採取業");
          });
        cy.get("@industry").click({ force: true });
        cy.contains("li", "農業・林業").should("exist").click({ force: true });
        cy.get("@industry")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("農業・林業");
          });
      });
      context("Kiểm tra textbox サービスの名称 (Service Name)", () => {
        it("GUI_23 - Kiểm tra hiển thị", () => {
          cy.get("@serviceName");
          cy.get("@serviceName").should("not.be.disabled");
          cy.get("@serviceName").should("have.value", "");
          cy.get("@serviceName").should(
            "have.attr",
            "placeholder",
            "IC WEBショッピング",
          );
        });

        it("GUI_24 - Kiểm tra bắt buộc nhập", () => {
          cy.typing("@serviceName");
          cy.get("@serviceName")
            .should("have.class", "is-error")
            .and("have.value", "");
          cy.checkToolTipValidate(true, "サービスの名称を入力してください。");
          cy.checkButton(false);
        });

        it("GUI_25 - Kiểm tra nhập liệu hợp lệ", () => {
          example.service_name.valid.forEach((val) => {
            cy.typing("@serviceName", val)
              .should("have.class", "is-valid")
              .then(($el) => {
                const text = $el.text();
                expect(text).to.match(notFullwidthOrSpaceRegex);
              });
            cy.checkToolTipValidate(false);
          });
        });

        it("GUI_26 - Kiểm tra nhập liệu không hợp lệ", () => {
          example.service_name.in_valid.forEach((val) => {
            cy.typing("@serviceName", val).should("have.class", "is-error");
            cy.checkToolTipValidate(
              true,
              "サービスの名称は全角文字、半角文字で入力してください。",
            );
            cy.checkButton(false);
          });
        });

        it("GUI_27 - Kiểm tra nhập từ bàn phím tiếng Nhật", () => {
          //Đã check ở GUI_25
        });

        it("GUI_28 - Kiểm tra max length.Nhập > 255 kí tự", () => {
          const longText = "a".repeat(256);
          cy.typing("@serviceName", longText).should("have.class", "is-error");
          cy.checkToolTipValidate(
            true,
            "サービスの名称は255文字以内で入力してください。",
          );
          cy.checkButton(false);
        });

        it("GUI_29 - Kiểm tra max length.Nhập = 255 kí tự", () => {
          const longText = "b".repeat(255);
          cy.typing("@serviceName", longText)
            .should("have.class", "is-valid")
            .and("have.value", longText);
          cy.checkToolTipValidate(false);
        });

        it("GUI_30 - Kiểm tra max length.Nhập < 255 kí tự", () => {
          const longText = "c".repeat(254);
          cy.typing("@serviceName", longText)
            .should("have.class", "is-valid")
            .and("have.value", longText);
          cy.checkToolTipValidate(false);
        });

        it("GUI_31 - Kiểm tra copy, paste dữ liệu", () => {
          const dataToPaste = "This is a data to paste";
          cy.get("@serviceName")
            .focus()
            .clear()
            .invoke("val", dataToPaste)
            .should("have.value", dataToPaste);
        });

        it("GUI_32 - Kiểm tra trim space đầu cuối", () => {
          const text = "  test space dau cuoi  ";
          cy.typing("@serviceName", text).should("have.value", text.trim());
        });

        it("GUI_33 - Kiểm tra trim space giữa chuỗi", () => {
          cy.typing("@serviceName", "hello　world　123").should(
            "have.value",
            "hello world 123",
          );
        });

        it("GUI_34 - Kiểm tra mức độ ưu tiên của các loại message validate", () => {
          const data = [
            {
              text: "  ",
              message: "サービスの名称を入力してください。",
            },
            {
              text: "😀".repeat(256),
              message: "サービスの名称は255文字以内で入力してください。",
            },
            {
              text: "😀😀😀😀",
              message: "サービスの名称は全角文字、半角文字で入力してください。",
            },
          ];
          data.forEach((item) => {
            cy.typing("@serviceName", item.text).should(
              "have.class",
              "is-error",
            );
            cy.checkToolTipValidate(true, item.message);
          });
        });
      });

      context("Kiểm tra hiển thị danh sách checkbox (Payment Service)", () => {
        it("GUI_38 - Kiểm tra check chọn 1 giá trị bất kì", () => {
          const arrCheckbox = [1, 2, 3, 4, 5];
          const r = Math.floor(Math.random() * arrCheckbox.length) + 1;
          cy.get(
            `:nth-child(${r}) > .c-unit-checkbox > .c-unit-checkbox__box`,
          ).click({ force: true });
          cy.wait(1000);
          cy.get(
            `:nth-child(${r}) > .c-unit-checkbox > .c-unit-checkbox__box`,
          ).should("have.class", "is-valid");
          arrCheckbox.filter((item) => {
            if (item !== r) {
              cy.get(
                `:nth-child(${item}) > .c-unit-checkbox > .c-unit-checkbox__box`,
              ).should("not.have.class", "is-valid");
            }
          });
        });
      });

      context("Kiểm tra trường WEBサイトURL (*) ", () => {
        it("GUI_41 - Kiểm tra label", () => {
          cy.get(
            ":nth-child(12) > :nth-child(5) > .c-table-box__inner--center > .c-table-box__head",
          ).as("Web");
          cy.get("@Web")
            .find(".c-table-box__title")
            .should("have.text", "WEBサイトURL (*)");
        });
        it("GUI_42 - Kiểm tra textbox WEBサイトURL (*)", () => {
          cy.get("@webURL");
          cy.get("@webURL").should("not.be.disabled");
          cy.get("@webURL").should("have.value", "");
          cy.get("@webURL").should(
            "have.attr",
            "placeholder",
            "https://mediamarket.jp",
          );
        });
        it("GUI_43 - Kiểm tra bắt buộc nhập", () => {
          cy.typing("@webURL");
          cy.get("@webURL")
            .should("not.have.class", "is-error")
            .and("have.value", "");
          cy.checkToolTipValidate(false);
        });
        it("GUI_44 - Kiểm tra nhập liệu hợp lệ", () => {
          example.web_url.valid.forEach((val) => {
            cy.typing("@webURL", val)
              .should("have.class", "is-valid")
              .then(($el) => {
                const text = $el.text();
                expect(text).to.match(notFullwidthOrSpaceRegex);
              });
            cy.checkToolTipValidate(false);
          });
        });
        it("GUI_45 - Kiểm tra nhập dữ liệu không hợp lệ", () => {
          example.web_url.in_valid.forEach((val) => {
            cy.typing("@webURL", val).should("have.class", "is-error");
            cy.checkToolTipValidate(
              true,
              "WEBサイトURLは半角英字、半角数字、半角記号で入力してください。",
            );
            cy.checkButton(false);
          });
        });

        it("GUI_46 - Nhập từ bàn phím tiếng Nhật", () => {
          //Check ở GUI_44 - trường hợp nhập fullwidth
        });

        it("GUI_47 - Kiểm tra max length.Nhập > 255 kí tự", () => {
          const longText = "a".repeat(256);
          cy.typing("@webURL", longText).should("have.class", "is-error");
          cy.checkToolTipValidate(
            true,
            "WEBサイトURLは255文字以内で入力してください。",
          );
          cy.checkButton(false);
        });

        it("GUI_48 - Kiểm tra max length.Nhập = 255 kí tự", () => {
          const longText = "b".repeat(255);
          cy.typing("@webURL", longText)
            .should("have.class", "is-valid")
            .and("have.value", longText);
          cy.checkToolTipValidate(false);
        });

        it("GUI_49 - Kiểm tra max length.Nhập < 255 kí tự", () => {
          const longText = "c".repeat(254);
          cy.typing("@webURL", longText)
            .should("have.class", "is-valid")
            .and("have.value", longText);
          cy.checkToolTipValidate(false);
        });

        it("GUI_50 - Kiểm tra copy, paste dữ liệu", () => {
          const dataToPaste = "This is a data to paste";
          cy.get("@webURL")
            .focus()
            .clear()
            .invoke("val", dataToPaste)
            .should("have.value", dataToPaste);
        });

        it("GUI_51 + 52 - Kiểm tra trim space", () => {
          cy.typing("@webURL", "  test space dau　cuoi  ").should(
            "have.value",
            "testspacedaucuoi",
          );
        });

        it("GUI_53 - Kiểm tra mức độ ưu tiên của các loại message validate", () => {
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
          data.forEach((item) => {
            cy.typing("@webURL", item.text).should("have.class", "is-error");

            cy.checkToolTipValidate(true, item.message);
          });
        });
      });
      it("GUI_60 - Kiểm tra pull down số lượng giao dịch dự kiến/tháng", () => {
        cy.get("@transactionPerMonth").click({ force: true });
        cy.contains("li", "1,000 - 10,000/回").should("exist").click();
        cy.get("@transactionPerMonth")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("1,000 - 10,000/回");
          });
        cy.get("@transactionPerMonth").click({ force: true });
        cy.contains("li", "10,001 - 100,000/回")
          .should("exist")
          .click({ force: true });
        cy.get("@transactionPerMonth")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("10,001 - 100,000/回");
          });
      });

      it("GUI_60.2 - Kiểm tra pull down số lượng giao dịch ước tính/tháng", () => {
        cy.get("@estimateAmountPerMonth").click({ force: true });
        cy.contains("li", "50,001 - 100,000 USD").should("exist").click();
        cy.get("@estimateAmountPerMonth")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("50,001 - 100,000 USD");
          });
        cy.get("@estimateAmountPerMonth").click({ force: true });
        cy.contains("li", "1,000 - 10,000 USD")
          .should("exist")
          .click({ force: true });
        cy.get("@estimateAmountPerMonth")
          .invoke("text")
          .then((text) => {
            expect(text.trim()).to.equal("1,000 - 10,000 USD");
          });
      });

      it("GUI_69 + 70 - Kiểm tra check qua lại giữa 2 checkbox", () => {
        cy.get("@usingApi").click({ force: true });
        cy.get("@usingApi").should("have.class", "is-active");
        cy.get("@notUsingApi").should("have.class", "is-inactive");
        cy.get("@notUsingApi").click({ force: true });
        cy.get("@notUsingApi").should("have.class", "is-active");
        cy.get("@usingApi").should("have.class", "is-inactive");
      });

      context(
        "Kiểm tra trường Hạn chế IP truy cập (*) (i) アクセスIP制限 (*)",
        () => {
          it("GUI_74 - Trường hợp No26 check chọn giá trị:+ '利用する'", () => {
            cy.get("@usingApi").click({ force: true });
            cy.wait(1000);
            cy.get("@ipAddress")
              .should("not.have.class", "is-disable")
              .should("have.value", "")
              .should(
                "have.attr",
                "placeholder",
                "200.200.200.1, 200.200.200.2, 200.200.200.3 複数の場合コンマ(,)区切りで登録",
              );
          });
          it("GUI_75 - Trường hợp No26 check chọn giá trị:+ '利用しない'", () => {
            cy.get("@notUsingApi").click({ force: true });
            cy.wait(1000);
            cy.get("@ipAddress")
              .should("have.class", "is-disable")
              .should("have.value", "")
              .should(
                "have.attr",
                "placeholder",
                "200.200.200.1, 200.200.200.2, 200.200.200.3 複数の場合コンマ(,)区切りで登録",
              );
          });
          it("GUI_76 - Trường hợp chuyển đổi qua lại giữa 2 loại checkbox", () => {
            cy.get("@usingApi").click({ force: true });
            cy.typing("@ipAddress", "192.168.1.1").should(
              "have.value",
              "192.168.1.1",
            );
            cy.wait(1000);
            cy.get("@notUsingApi").click({ force: true });
            cy.wait(1000);
            cy.get("@ipAddress")
              .should("have.class", "is-disable")
              .should("have.value", "")
              .should(
                "have.attr",
                "placeholder",
                "200.200.200.1, 200.200.200.2, 200.200.200.3 複数の場合コンマ(,)区切りで登録",
              );
          });
          it("GUI_77 - Kiểm tra bắt buộc nhập", () => {
            cy.get("@ipAddress").click({ force: true });
            cy.wait(1000);
            cy.typing("@ipAddress");
            cy.get("@ipAddress")
              .should("not.have.class", "is-error")
              .and("have.value", "");
            cy.checkToolTipValidate(false);
          });
          it("GUI_78 - Kiểm tra nhập liệu hợp lệ", () => {
            cy.get("@usingApi").click({ force: true });
            example.ip_address.valid.forEach((val) => {
              cy.typing("@ipAddress", val)
                .should("have.class", "is-valid")
                .then(($el) => {
                  const text = $el.text();
                  expect(text).to.match(notFullwidthOrSpaceRegex);
                });
              cy.checkToolTipValidate(false);
            });
          });
          it("GUI_79 - Kiểm tra nhập dữ liệu không hợp lệ", () => {
            // Tất cả case hiển thị message "IPアドレスを正しく入力してください。" đều check ở đây
            cy.get("@usingApi").click({ force: true });
            example.ip_address.in_valid.forEach((val) => {
              cy.typing("@ipAddress", val).should("have.class", "is-error");
              cy.wait(1000);
              cy.checkToolTipValidate(
                true,
                "IPアドレスを正しく入力してください。",
                ".c-input-common__tooltip-item",
              );
              cy.checkButton(false);
            });
          });
          it("GUI_115 - Kiểm tra max length", () => {
            cy.get("@usingApi").click({ force: true });
            const textMaxLength = "192.168.1.1, ".repeat(22).slice(0, -2);
            cy.log(`Đã nhâp ${textMaxLength.length} kí tự`);
            cy.typing("@ipAddress", textMaxLength).should(
              "have.class",
              "is-valid",
            );
            cy.checkToolTipValidate(false);
          });
        },
      );

      context("Kiểm tra Back browser và reload màn hình", () => {
        it("GUI_134 - Kiểm tra back browser", () => {
          cy.go(-1);
          cy.url().should(
            "eq",
            `${Cypress.env("mm-host")}/merchant/registration/`,
          );
          cy.wait(5000);
          cy.get(".c-box-check__body").should("have.class", "is-valid");
        });

        it("GUI_137 - Reload màn hình khi không nhập trường bắt buộc", () => {
          cy.get("@usingApi").click({ force: true });
          cy.typing("@serviceName").should("have.class", "is-error");
          cy.reload();
          cy.get("@serviceName").should("not.have.class", "is-error");
        });

        it("GUI_138 - Nhập dữ liệu invalid", () => {
          cy.typing("@serviceName", "😀😀").should("have.class", "is-error");
          cy.reload();
          cy.get("@serviceName").should("have.class", "is-error");
          cy.wait(1000);
          cy.get("@serviceName")
            .parent()
            .checkToolTipValidate(
              true,
              "サービスの名称は全角文字、半角文字で入力してください。",
            );
        });

        it("GUI_139 - Nhập all data hợp lệ", () => {
          cy.fillAllFieldsMerchant(DATA_MERCHANT_FILL);
          cy.checkButton(true);
          cy.reload();
          cy.checkFieldMerchant(DATA_MERCHANT_FILL);
          cy.checkButton(true);
        });
      });
    },
  );

  context(
    `KIỂM TRA MÀN: ${Cypress.env("mm-host")}/merchant/registration/check`,
    () => {
      it("GUI_39 - Kiểm tra back browser", () => {
        cy.fillAllFieldsMerchant(DATA_MERCHANT_FILL);
        paymentService = PAYMENT_SERVICE_TEXT.find(
          (item) => item.paymentService === DATA_MERCHANT_FILL.paymentService,
        ).text;
        cy.get(".c-btn-common--blue").click();
        cy.go(-1);
        cy.url().should(
          "eq",
          `${Cypress.env("mm-host")}/merchant/registration/input/`,
        );
        cy.checkFieldMerchant(DATA_MERCHANT_FILL);
      });

      it("GUI_44 - Kiểm tra reload màn hình", () => {
        cy.fillAllFieldsMerchant(DATA_MERCHANT_FILL);
        cy.get(".c-btn-common--blue").click();
        cy.contains(DATA_MERCHANT_FILL.model ? "B to Cモデル" : "B to Bモデル");
        cy.contains(DATA_MERCHANT_FILL.industry);
        cy.contains(DATA_MERCHANT_FILL.serviceName);
        cy.contains(DATA_MERCHANT_FILL.webURL);
        cy.contains(DATA_MERCHANT_FILL.transactionPerMonth);
        cy.contains(DATA_MERCHANT_FILL.estimateAmountPerMonth);
        cy.contains(DATA_MERCHANT_FILL.ipAddress);
        cy.contains(paymentService);
      });

      it("GUI_45 +  46 + 47- Kiểm tra thực hiện đăng ký thành công", () => {
        cy.fillAllFieldsMerchant(DATA_MERCHANT_FILL);
        cy.get(".c-btn-common--blue").click();
        cy.intercept("POST", "**/create").as("createMerchant");
        cy.get(".c-unit-btn-wrap__btn > .c-btn-common--orange").click();

        cy.wait("@createMerchant").then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
        });
        cy.url().should(
          "eq",
          `${Cypress.env("mm-host")}/merchant/registration/request-success/`,
        );

        // Check các case màn request_success

        //GUI_12 - Kiểm tra reload màn hình
        cy.reload();
        cy.url().should(
          "eq",
          `${Cypress.env("mm-host")}/merchant/registration/request-success/`,
        );

        //GUI_9 - Kiểm tra back browser
        cy.wait(3000);
        cy.go(-1);
        cy.wait(3000);
        cy.url().should("eq", `${Cypress.env("mm-host")}/`);
      });
    },
  );
});
