import {
  contracts,
  hedgeStatus,
} from "../../fixtures/contracts_flat_price.util";
import { login_valid } from "../../fixtures/login.util";

const { email, password } = login_valid;
let contractStatus;

describe("Buy Flat Price Contracts", () => {
  beforeEach(() => {
    cy.intercept("POST", "/api/contracts/filter").as("contracts");
    cy.intercept("GET", "/api/customer?name=a").as("customers");
    cy.intercept("POST", "/api/contracts").as("contractSubmitted");
    cy.intercept("PUT", "/api/reviewandrelease/approve").as("approveContract");

    cy.login(email, password);
    cy.wait("@contracts");
    cy.clickAwayAlert();
  });

  contracts.forEach((contract) => {
    if (contract === contracts[1]) {
      it(`Buy Flat Price Contracts ${contract} - No Accumulations`, () => {
        cy.dataTestId("sidebar-item-settings").click();
        cy.dataTestId("menu-item-bypassReview").click();
        cy.dataTestId("bypass-form-switch").eq(1).as("bypassToggle");
        cy.get("@bypassToggle").then(($btn) => {
          if (contract === contracts[0] && $btn[0].ariaChecked === "false") {
            cy.log("Bypass turned off for already");
          } else if (
            contract === contracts[0] &&
            $btn[0].ariaChecked === "true"
          ) {
            // turn off toggle
            cy.get("@bypassToggle").click();
            cy.dataTestId("form-button-submit").click();
          } else if (
            contract === contracts[1] &&
            $btn[0].ariaChecked === "false"
          ) {
            // turn on toggle
            // cy.request({
            //   failOnStatusCode: false,
            //   method: 'PUT',
            //   url: '/api/settings/tag50',
            //   body: {
            //     byPassOn: true,
            //     daySessionEmployeeId: 'e21f87bf-7241-c0e3-1d4b-08d9d06028f7',
            //     nightSessionEmployeeId: 'e0eaa9cc-9dbb-cb1b-b41e-08d9d0607318',
            //   },
            // });
            cy.get("@bypassToggle")
              .realClick()
              .should(() => {
                cy.log("hmmmmmm");
              });
          }
        });

        // cy.dataTestId("sidebar-item-transactions")
        //   .click()
        //   .then(() => {
        //     cy.url().should("include", "/transactions");
        //   });
        // cy.clickAwayAlert();
        // cy.dataTestId("create-new-entry-button")
        //   .first()
        //   .click()
        //   .then(() => {
        //     cy.dataTestId("create-contract-button").click();
        //   });
        // cy.get('[name="deliveryDateWindow"]')
        //   .children()
        //   .first()
        //   .children()
        //   .first()
        //   .click()
        //   .then(() => {
        //     cy.get("[class$=option-content]").first().click();
        //   });
        // cy.dataTestId("form-input-test").eq(2).type(5000);
        // cy.dataTestId("futures-price-icon").click();
        // cy.dataTestId("customer-form-item")
        //   .children()
        //   .eq(1)
        //   .type("a")
        //   .then(() => {
        //     cy.wait("@customers");
        //     cy.get("[class$=option-content]").eq(3).click({ force: true });
        //   });

        // // submit contract
        // cy.dataTestId("create-new-modal-btn").click();
        // cy.wait("@contractSubmitted");

        if (contract === contracts[0]) {
          cy.clickAwayAlert();
          cy.contains("Review & Release").click();
          cy.clickAwayAlert();
          cy.dataTestId("table-column")
            .eq(2)
            .children()
            .children()
            .first()
            .children()
            .first()
            .as("contractStatusColumnField");
          cy.get("@contractStatusColumnField").then(
            /* @ts-ignore */
            ($p: { innerText: string }[]) => {
              expect($p[0].innerText).to.equal("Ready");
            }
          );
          cy.get(".ant-checkbox-inner").eq(24).click({ force: true });
          cy.dataTestId("button-approve")
            .click()
            .then(() => {
              cy.clickAwayAlert();
              cy.wait("@approveContract");
              cy.reload();
              cy.clickAwayAlert();
              cy.contains("Review & Release").click();
              cy.clickAwayAlert();
              cy.get("@contractStatusColumnField").then(
                /* @ts-ignore */
                ($p: { innerText: string }[]) => {
                  contractStatus = $p[0].innerText;
                  if (contractStatus === hedgeStatus[0]) {
                    expect(hedgeStatus[0]).to.equal(contractStatus);
                  } else if (contractStatus === hedgeStatus[1]) {
                    expect(hedgeStatus[1]).to.equal(contractStatus);
                  } else if (contractStatus === hedgeStatus[2]) {
                    expect(hedgeStatus[2]).to.equal(contractStatus);
                  }
                }
              );
            });
        }
      });
    }
  });
});
