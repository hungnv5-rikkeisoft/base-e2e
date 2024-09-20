// For reCAPTCHA v2, use the following test keys. You will always get No CAPTCHA and all verification requests will pass.

// Site key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
// Secret key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

Cypress.Commands.add("loginAndSaveCookies", (host) => {
  cy.intercept("GET", "**/me").as("meRequest");

  cy.visit(host); //`${Cypress.env("mm-host")}/`

  cy.get("input[type=text]").as("email");
  cy.get("input[type=password]").as("password");

  cy.get("@email")
    .focus()
    .clear()
    .type(`${Cypress.env("email")}`);
  cy.get("@password")
    .focus()
    .clear()
    .type(`${Cypress.env("password")}`);
  cy.get("@password").focus().type("{enter}");

  cy.wait("@meRequest").then((interception) => {
    expect(interception.response.statusCode).to.equal(200);
    cy.getCookies().then((cookies) => {
      Cypress.env("savedCookies", cookies);
    });
  });
});

Cypress.Commands.add("setCookieAfterLogin", () => {
  const cookies = Cypress.env("savedCookies");
  if (cookies) {
    cookies.forEach((cookie) => {
      cy.setCookie(cookie.name, cookie.value);
    });
  }
});

Cypress.Commands.add("typing", (field, val) => {
  if (val) {
    cy.get(field).focus().clear().type(val).blur();
  } else {
    cy.get(field).focus().clear().blur();
  }
});

Cypress.Commands.add(
  "checkToolTipValidate",
  (
    isExist,
    text,
    classTooltip = ".c-input-common__tooltip-item--white-space-inherit",
  ) => {
    if (isExist) {
      cy.get(classTooltip).should("be.visible").and("have.text", text);
    } else {
      cy.get(classTooltip).should("not.exist");
    }
  },
);
