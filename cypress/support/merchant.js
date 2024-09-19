Cypress.Commands.add("getFieldMerchant", (fieldName) => {
  const selectors = {
    B_to_C:
      ".c-unit-radio-box--check > .c-unit-radio-box__body--hint:nth-child(1)",
    B_to_B:
      ".c-unit-radio-box--check > .c-unit-radio-box__body--hint:nth-child(2)",
    industry:
      ":nth-child(12) > :nth-child(2) > .c-table-box__inner--center > .c-table-box__body > .c-select-common--current-hidden > .nice-select > .current",
    serviceName:
      ":nth-child(12) > :nth-child(3) > .c-table-box__inner--center > .c-table-box__body > .c-input-common--info > input",
    webURL:
      ":nth-child(12) > :nth-child(5) > .c-table-box__inner--center > .c-table-box__body > .c-input-common--info > input",
    transactionPerMonth:
      ":nth-child(1) > .c-table-box__inner--center > .c-table-box__body > .c-select-common--current-hidden > .nice-select > .current",
    estimateAmountPerMonth:
      ":nth-child(18) > :nth-child(2) > .c-table-box__inner--center > .c-table-box__body > .c-select-common--current-hidden > .nice-select > .current",
    usingApi:
      ".c-unit-radio-box--row > .c-unit-radio-box__body--small:nth-child(1)",
    notUsingApi:
      ".c-unit-radio-box--row > .c-unit-radio-box__body--small:nth-child(2)",
    ipAddress:
      ".c-table-box__inner > .c-table-box__body > .c-input-common--info > textarea",
  };

  const selector = selectors[fieldName];

  if (selector) {
    cy.get(selector).as(fieldName);
  } else {
    throw new Error(`Unknown field name: ${fieldName}`);
  }
});

Cypress.Commands.add("checkButton", (isEnable) => {
  if (isEnable) {
    cy.get(".c-btn-common--height-middle.c-btn-common--width-large")
      .should("be.visible")
      .should("have.class", "c-btn-common--blue")
      .get(".u-fontsize--default.u-lineheight--line")
      .first()
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("次へ進む");
      });
  } else {
    cy.get(".c-btn-common--height-middle.c-btn-common--width-large")
      .should("be.visible")
      .should("have.class", "c-btn-common--disable")
      .get(".u-fontsize--default.u-lineheight--line")
      .first()
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        expect(text.trim()).to.equal("入力してください");
      });
  }
});
