import { todaySDate } from '../../fixtures/date';
import { VVV_DEMO_USER_ONE } from '../../fixtures/login.util';
import path = require('path');

describe('Management Dashboard', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.checkRejectedHedges();

		cy.intercept('GET', '/api/dashboard/longandshortsummary**').as('dashboard');
		cy.intercept('GET', '/api/reportexecution/execute/basisSummary**').as('basisSum');
		cy.intercept('GET', '/api/reportexecution/export/excel/basisSummary**').as('excelBasisSummary');
		cy.intercept('GET', '/api/locations**').as('locations');
		cy.intercept('GET', '/api/reportexecution/metadata/basisSummary').as('metaData');
		cy.dataTestId('drawer-trigger').click();
		cy.dataTestId('drawer-wrapper-content').children().children().first().children().eq(0).children().as('dashboardTabItems');
		cy.get('@dashboardTabItems').children().eq(1).as('L&SRecap');
		cy.get('@dashboardTabItems').children().eq(2).as('cashSummary');
		cy.get('@dashboardTabItems').children().eq(3).as('basisSummary');
	});

	it('Ability to access Management Dashboard', () => {
		cy.get('@dashboardTabItems').children().first().should('have.class', 'ant-tabs-tab-active');
		cy.get('@L&SRecap').find('label').should('have.text', 'L&S Recap ');
		cy.get('@cashSummary').find('label').should('have.text', 'Cash Summary ');
		cy.get('@basisSummary').find('label').should('have.text', 'Basis Summary ');
	});

	it('Ability to tab through all available dashboard views', () => {
		cy.get('@L&SRecap').click();
		cy.get('@L&SRecap').should('have.class', 'ant-tabs-tab-active');
		cy.get('@cashSummary').click();
		cy.get('@cashSummary').should('have.class', 'ant-tabs-tab-active');
		cy.get('@basisSummary').click();
		cy.get('@basisSummary').should('have.class', 'ant-tabs-tab-active');
	});

	it('Verify that Basis Summary is accessible from the Management Dashboard', () => {
		cy.get('@basisSummary').click();
		cy.get('@basisSummary').should('have.class', 'ant-tabs-tab-active');
		cy.wait('@basisSum');
	});

	it('Verify that Basis Summary is exportable', () => {
		cy.get('@basisSummary').click();
		cy.wait('@metaData');
		cy.checkRejectedHedges();
		cy.dataTestId('excel-export-button').click();
		const downloadsFolder = Cypress.config('downloadsFolder');
		const downloadedFilename = path.join(downloadsFolder, 'Report.xlsx');

		cy.readFile(downloadedFilename, 'binary', { timeout: 5000 }).should(buffer => {
			expect(buffer.length).to.be.gt(100);
		});
	});
	it('Verify that "Long & Short" Tab is defaulted with the commodity set in the default page via "Settings" page', () => {
		// check Long & Short Tab is defaulted
		cy.get('@dashboardTabItems').children().first().should('have.class', 'ant-tabs-tab-active');
		// default commodity is set in filter
		cy.wait(['@dashboard', '@locations']);
		cy.dataTestId('filter-single').eq(3).find('span[class$="wrapper"]').should('have.text', 'Corn');
	});

	it('Ability to filter by other commodities than default commodity type set in the "Default Page" via "Settings" page', () => {
		cy.dataTestId('filter-single').eq(3).click();
		cy.dataTestId('filter-single-Soybeans').click();
		cy.dataTestId('filter-single-Soybeans').should('have.class', 'ant-select-item-option-selected');
	});

	it('Verify that when a commodity is selected that they can also select a given year', () => {
		cy.dataTestId('filter-date').type(todaySDate);
		cy.dataTestId('filter-single').eq(3).click();
		cy.dataTestId('filter-single-Soybeans').click();
		cy.get('tr').should('be.visible');
	});
});
