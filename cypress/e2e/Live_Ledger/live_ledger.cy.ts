import { todaySDate } from '../../fixtures/date';
import { VVV_DEMO_USER_ONE } from '../../fixtures/login.util';

import path = require('path');
import moment = require('moment');

describe('Live Ledger Module', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.checkRejectedHedges();
		cy.dataTestId('sidebar-item-liveLedger').click();

		cy.intercept('GET', '/api/liveledger/export/**').as('exportLedger');
		cy.intercept('GET', '/api/liveledger?**').as('ledger');
		cy.intercept('GET', 'https://find.userpilot.io/v1/lookups/**').as('date');
	});

	it('Ability to access Live Ledger Module', () => {
		cy.location().should(loc => {
			expect(loc.pathname).to.equal('/live-ledger');
		});
	});

	it('Ability to view Tool Tip when hovering over "Live Ledger" option', () => {
		cy.get('.sidebar-tooltip').contains('Live Ledger').should('not.be.visible');
		cy.dataTestId('sidebar-item-liveLedger')
			.trigger('mouseover')
			.then(() => {
				cy.get('.sidebar-tooltip').contains('Live Ledger').should('exist');
			});
	});

	it('Ability to filter "Live Ledger" by an available and given commodity', () => {
		cy.dataTestId('commodities-list-filter').click();
		cy.get('[data-testid^="commodity-option"]').contains('Corn').click();
		cy.wait('@ledger').its('response.statusCode').should('eq', 200);
	});

	it('Ability to hover over Event and see action taken for line entry', () => {
		cy.get('.popover--content').should('not.exist');
		cy.get('[data-testid*="event-icon"]').first().trigger('mouseover');
		cy.get('.popover--content').should('exist');
	});

	it('Ability to view daily balance for a given date', () => {
		cy.dataTestId('filter-date').type(todaySDate);
		cy.get('body').click(0, 0);
		cy.wait('@ledger').its('response.statusCode').should('eq', 200);
	});

	it('Ability to export current data on Live Ledger page', () => {
		cy.dataTestId('filter-date').type(todaySDate);
		cy.get('body').click(0, 0);
		cy.wait('@ledger').then(res => {
			expect(res.response.statusCode).to.equal(200);
		});
		cy.get('button[type="button"]').contains('Export').click({ force: true });

		const downloadsFolder = Cypress.config('downloadsFolder');
		const downloadedFilename = path.join(downloadsFolder, `ZCE - Live Ledger ${moment().format('DD-MM-YY')}.xlsx`);
		cy.readFile(downloadedFilename, 'binary', { timeout: 5000 }).should(buffer => {
			expect(buffer.length).to.be.gt(100);
		});
	});
});
