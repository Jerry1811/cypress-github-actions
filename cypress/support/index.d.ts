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

			/**
			 * custom command to select option from dropdown
			 */
			selectOptionFromDropdown(): any;

			/**
			 * custom command to click on report filter option and select option from dropdown
			 * @example
			 * cy.reportDropdown(1, 'Create')
			 */
			reportDropdown(index: Number, dropdownOption: any): any;

			navigateToReportsAndSelectReportType(reportType: string): any;

			checkRejectedHedges(): any;

			/**
			 * custom command to check success or error message after adding, editing or deleting an item
			 * @param message
			 * @example cy.checkToastMessage('Success')
			 */
			checkToastMessage(message: string): void;

			enterTwoDates(dateOne: any, dateTwo: any): any;

			/**
			 * custom command to assert when a filter returned zero results
			 * @example cy.zeroResultsAssertion()
			 */
			zeroResultsAssertion(): any;
		}
	}
}
