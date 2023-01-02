export {};
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Custom command to select DOM element by data-testid attribute.
       * @example cy.dataTestId('login')
       */
      dataTestId(value: string): any;
      /**
       * Login through microsoft third party auth
       * @example
       * cy.login('user@microsoft.com', 'test')
       */
      login(email: string, password: string): any;
      /**
       * Custom command to navigate to contract management module from anywhere on the platform
       */
      navigateToContractManagementModule(): any;
      /**
       * custom to command to click okay on modal alert pop-up
       */
      clickAwayAlert(): any;
    }
  }
}
