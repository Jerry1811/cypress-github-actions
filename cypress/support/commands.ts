/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('dataTestId', value => {
	return cy.get(`[data-testid=${value}]`);
});

Cypress.Commands.add('login', (email, password) => {
	const args = { email, password };
	cy.visit('/');
	cy.dataTestId('login-button').click();
	cy.origin('https://login.microsoftonline.com/', { args }, ({ email, password }) => {
		cy.get('input[type="email"]').should('be.visible').type(`${email}{enter}`, { log: false });
		cy.get('input[type="password"]').should('be.visible').type(`${password}{enter}`, { log: false });
		cy.get('#idSIButton9').click();
	});

	cy.visit('/');
	cy.location().should(loc => {
		expect(loc.pathname).to.eq('/transactions');
	});
});

Cypress.Commands.add('navigateToContractManagementModule', () => {
	cy.dataTestId('sidebar-item-transactions').click();
	cy.location().should(loc => {
		expect(loc.pathname).to.equal('/transactions');
	});
	cy.checkRejectedHedges();
});

Cypress.Commands.add('clickAwayAlert', () => {
	cy.dataTestId('confirm-button').click({ force: true });
});

Cypress.Commands.add('selectOptionFromDropdown', () => {
	cy.get('[class^="ant-select-dropdown"]').last().invoke('show').find('div').first().click();
});

Cypress.Commands.add('reportDropdown', (index, dropdownOption) => {
	cy.dataTestId('field-wrapper').eq(index).click();
	cy.get('.ant-select-item-option-content').contains(dropdownOption).click();
});

Cypress.Commands.add('navigateToReportsAndSelectReportType', reportType => {
	cy.get('.ant-select-selection-search').click();
	cy.get('.ant-select-item-option-content').contains(reportType).click();
});

Cypress.Commands.add('checkRejectedHedges', () => {
	cy.get('body')
		.wait(300)
		.then($body => {
			if ($body.find('[data-testid=confirm-button]').length) {
				return cy.clickAwayAlert();
			}
		});
});

Cypress.Commands.add('checkToastMessage', message => {
	cy.get('[class*="toast-message"]').find('div[class="ant-notification-notice-message"]').should('contain', message);
});

Cypress.Commands.add('enterTwoDates', (dateOne, dateTwo) => {
	cy.get('.ant-picker-input').first().type(dateOne);
	cy.get('body').click(0, 0);
	cy.get('.ant-picker-input').eq(1).type(dateTwo);
	cy.get('body').click(0, 0);
});

Cypress.Commands.add('zeroResultsAssertion', () => {
	cy.dataTestId('filter-empty').find('p').should('have.text', 'There are no results for these filters. \n Try again!');
});
