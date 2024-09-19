/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe(`TRUY CẬP SITE MEDIA MARKET: ${Cypress.env("mm-host")}/`, () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("mm-host")}/`, { failOnStatusCode: false });
  });

  beforeEach(() => {
    cy.get(".column__inner-box--flex").as("loginForm");
    cy.get("@loginForm").find("input[type=text]").as("email");
    cy.get("@loginForm").find("input[type=password]").as("password");
  });
  afterEach(() => {
    cy.wait(1000);
  });

  context("GUI", () => {
    it("GUI_1 Kiểm tra di chuyển màn hình thành công- Hiển thị màn hình login", () => {
      cy.location("pathname").should("contain", "login");
    });

    it("GUI_2 Kiểm tra title màn hình", () => {
      cy.contains("Login to Account")
        .should("exist")
        .should("be.visible")
        .should("have.class", "c-heading-large");
    });

    context("Kiểm tra textbox Email", () => {
      it("GUI_3 Kiểm tra hiển thị", () => {
        cy.get("@email").should("be.enabled").should("be.empty");
      });
      it("GUI_4 Kiểm tra bắt buộc nhập", () => {
        cy.get("@email")
          .focus()
          .blur()
          .should("have.class", "is-error")
          .wait(500)
          .get("span.c-input-common__tooltip")
          .should("exist")
          .should("have.class", "is-show")
          .contains("メールアドレスを入力してください。");
      });
      it("GUI_5 Kiểm tra nhập dữ liệu hợp lệ", () => {
        cy.get("@email")
          .focus()
          .clear()
          .type("nhiendt@rikkeisoft.com")
          .blur()
          .wait(500)
          .get("span.c-input-common__tooltip")
          .should("not.exist");
      });
      it("GUI_6 Nhập sai định dạng", () => {
        cy.get("@email")
          .focus()
          .clear()
          .type(".com")
          .blur()
          .wait(500)
          .get("span.c-input-common__tooltip")
          .should("have.class", "is-show")
          .contains("メールアドレスの形式が間違っています。");
      });
      it("GUI_7 Nhập ký tự không cho phép", () => {
        cy.get("@email")
          .clear()
          .type("あ.com")
          .blur()
          .wait(500)
          .get("span.c-input-common__tooltip")
          .should("have.class", "is-show")
          .contains(
            "メールアドレスは半角英字、半角数字、半角記号で入力してください。"
          );
      });
      it("GUI_8 Kiểm tra maxlength", () => {
        cy.get("@email")
          .clear()
          .type(
            "morethan256@g.comaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
          )
          .blur()
          .wait(500)
          .get("span.c-input-common__tooltip")
          .should("have.class", "is-show")
          .contains("メールアドレスは255文字以内で入力してください。");
      });
      it("GUI_9 Kiểm tra copy-paste", () => {
        const textToCopy = "copy@gmail.com";

        cy.get("@email").invoke("val", textToCopy).wait(500);
      });
      it("GUI_10 Kiểm tra trim space ", () => {
        const textInludeSpace = "space include @gmail.com    ";

        const textAferTrim = textInludeSpace.replace(/\s+/gim, "");
        cy.get("@email")
          .clear()
          .type(textInludeSpace)
          .blur()
          .wait(500)
          .should("contain.value", textAferTrim);
      });
    });

    it("GUI_11 Kiểm tra button 入力してください", () => {
      cy.contains("入力してください")
        .should("exist")
        .should("have.class", "u-lineheight--line u-fontsize--small")
        .should("have.css", "pointer-events");
    });
    it("GUI_12 Kiểm tra link Privacy policy", () => {
      cy.contains("Privacy policy")
        .should("exist")
        .should("have.class", "footer__link")
        .should("have.attr", "href")
        .and("equal", "https://dev.mediamarket.jp/access.php?id=privacy");

      cy.contains("Privacy policy").click();
    });
    context("GUI 13_14", () => {
      it("GUI_13 Kiểm tra back browser (*)", () => {
        cy.visit(`${Cypress.env("mm-host")}/`);

        cy.go("back");
        cy.location("pathname").should("include", "login");
      });
      it("GUI_14 Kiểm tra màn hình loading", () => {
        // cy.get("@email").clear().type("hung@gmail.com");
        // cy.get("@password").type("aaaaaaaaaaaaa").blur();
        // cy.get("@loginForm").contains("Login").click();
        // cy.get(".c-loading")
        //   .should("be.visible")
        //   .wait(2500)
        //   .should("not.be.visible");
      });
      it("GUI_15 Kiểm tra thực hiện reload màn hình", () => {
        const textEmail = "hunghung@gmail.com";
        const textPw = "pwwwwwwwwwwwww";
        cy.get("@email").clear().type(textEmail);
        cy.get("@password").type(textPw).blur();

        cy.reload();
        cy.get("@email").should("contain.value", textEmail);
      });
    });
  });

  context("FUNCTION", () => {
    beforeEach(() => {
      cy.get("@email").type("hung@yopmail.com");
      cy.get("@password").type("123456789aA@").blur();
    });

    it("FUNCTION_1 Kiểm tra thực hiện xử lý Google reCAPTCHA", () => {
      cy.get("@loginForm").contains("Login").click();
      cy.get("iframe[src*=recaptcha]").should("exist");
    });
    it("FUNCTION_2 Kiểm tra login thành công", () => {
      cy.intercept("POST", "**/login", { fixture: "/login/sucess.json" }).as(
        "loginSuccess"
      );
      cy.intercept("GET", "**/me", { fixture: "/login/me.json" }).as(
        "meSuccess"
      );
      cy.get("@loginForm").contains("Login").click().wait(2000);
      cy.location("pathname").should("equal", "/");
    });

    it("FUNCTION_3 Kiểm tra thực hiện login thất bại", () => {
      cy.intercept("POST", "**/login", {
        fixture: "/login/fail.json",
        statusCode: 500,
      }).as("loginFail");
      cy.get("@loginForm").contains("Login").click();
      cy.get("@email").should("have.class", "is-error");

      cy.get("span.c-input-common__tooltip").should(
        "contain.text",
        "Emailまたは、パスワードが異なっています。"
      );
    });

    it("FUNCTION_4 Kiểm tra đăng nhập với các trạng thái của user", () => {
      cy.get("@loginForm").contains("Login").click();
    });

    it("FUNCTION_5 Kiểm tra thực hiện login bằng Google", () => {
      // cy.intercept("POST", "/your/captcha/endpoint", (req) => {
      //   req.reply({ captchaPassed: true });
      // });
      // c-btn-common--sns
      cy.get("@loginForm")
        .first()
        .find(".c-btn-common--sns")
        .should("exist")
        .should("be.visible")
        .click();
    });

    it("FUNCTION_6 Login trên nhiều trình duyệt khác nhau:  Không xử lý được", () => {
      // Không xử lý được
    });

    it("FUNCTION_7 Kiểm tra error log  (BE K xử lý ở FE)", () => {
      // (BE Bypass)
    });
  });
});
