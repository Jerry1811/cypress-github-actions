import { login_valid } from "../fixtures/login.util";

const { email, password } = login_valid;

describe("empty spec", () => {
  it("passes", () => {
    cy.login(email, password);
  });
});
