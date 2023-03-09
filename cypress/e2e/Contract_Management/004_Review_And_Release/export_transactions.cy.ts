import { VVV_DEMO_USER_ONE } from '../../../fixtures/login.util';

const path = require('path');

describe('Export Transactions', () => {
	before(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.get('[id$=reviewAndRelease]').first().click();
		cy.checkRejectedHedges();
		cy.get('.ant-picker-clear').click();
	});

	it('export transactions', () => {
		cy.intercept('POST', '/api/ReviewAndRelease/export').as('file');
		cy.dataTestId('button-external-fill').siblings().eq(1).click();
		cy.wait('@file');
		const downloadsFolder = Cypress.config('downloadsFolder');
		const downloadedFilename = path.join(downloadsFolder, 'ReviewAndRelease.xlsx');

		cy.readFile(downloadedFilename, 'binary', { timeout: 5000 }).should(buffer => {
			expect(buffer.length).to.be.gt(100);
		});
		cy.log('**the file exists**');
	});
});
