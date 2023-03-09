import { VVV_DEMO_USER_ONE } from '../../../fixtures/login.util';

describe('View Details', () => {
	before(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.get('[id$=reviewAndRelease]').first().click();
		cy.checkRejectedHedges();
		cy.get('.ant-picker-clear').click();
	});

	it('view details', () => {
		cy.intercept('GET', '/api/reviewandrelease/detail/**').as('selectedHedge');
		cy.dataTestId('table-column').find('button[type="button"]').first().click();
		cy.dataTestId('view-button').click();

		cy.wait('@selectedHedge');
		cy.dataTestId('source-table').should('exist');
		cy.get('.ant-list-items').should('have.descendants', 'div');
	});
});
