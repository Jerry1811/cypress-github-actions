import { VVV_DEMO_USER_ONE } from '../../../fixtures/login.util';

describe('Contract Management Module', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.checkRejectedHedges();
	});

	it('access contract management module', () => {
		// verify user is on contract management module
		cy.dataTestId('sidebar-item-transactions').should('have.class', 'ant-menu-item-selected');
		// contracts table should be on the page
		cy.dataTestId('generic-table').should('be.visible').and('have.descendants', 'table');
	});

	it('navigate to contract management module from anywhere', () => {
		// navigate to live ledger page
		cy.dataTestId('sidebar-item-liveLedger').click();
		cy.location().should(loc => {
			expect(loc.pathname).to.equal('/live-ledger');
		});

		// navigate back to contract management module
		cy.navigateToContractManagementModule();

		// navigate to settings page
		cy.dataTestId('sidebar-item-settings')
			.click()
			.then(() => {
				cy.location().should(loc => {
					expect(loc.pathname).to.equal('/settings');
				});
			});

		// navigate back to contract management module
		cy.navigateToContractManagementModule();
	});
});
