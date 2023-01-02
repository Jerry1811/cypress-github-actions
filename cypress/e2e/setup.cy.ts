import { login_valid } from "../fixtures/login.util";

const { email, password } = login_valid;

describe("empty spec", () => {
  it("passes", () => {
    // cy.login(email, password);
    cy.visit("/");
    cy.clock();
    cy.get("#timerAlertButton").click();
    cy.tick(5000);
    cy.on("window:alert", (text) => {
      expect(text).to.equal("Godsway says I should re run with a wrong text");
    });
  });
});
