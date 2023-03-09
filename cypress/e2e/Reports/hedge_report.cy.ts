import { todaySDate } from '../../fixtures/date';
import { commodities } from '../../fixtures/env.data';
import { VVV_DEMO_USER_ONE } from '../../fixtures/login.util';
import { routes } from '../../fixtures/routes';
import { hedgeReportAssertion, hedgeReportInvalidDates } from './_helpers/reports.helper';

describe('Hedge Reports', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.checkRejectedHedges();
		cy.dataTestId('sidebar-item-reports').click();
		cy.navigateToReportsAndSelectReportType('Hedge Report');

		cy.intercept('GET', routes.hedge_accounts).as('hedgeAccounts');
		cy.intercept('GET', routes.reports_futures_month).as('futuresMonth');
		cy.intercept('GET', routes.commodities).as('commodities');
		cy.intercept('GET', routes.execute_report).as('hedgeReports');
		cy.wait(['@commodities', '@hedgeAccounts', '@futuresMonth']);
	});

	it('Generate Hedge Report without selecting any filters', () => {
		hedgeReportAssertion('hedgeReports');
	});

	it('Generate Hedge Report with a given date range', () => {
		cy.enterTwoDates('2022-12-01', todaySDate);
		hedgeReportAssertion('hedgeReports');
	});

	it('Generate Hedge Report with an invalid date range', () => {
		cy.enterTwoDates('2020-09-01', '2020-10-20');
		hedgeReportInvalidDates();
	});

	it('Generate Hedge Report with an invalid date range - invalid start date and valid end date', () => {
		cy.enterTwoDates('2090-09-01', todaySDate);
		hedgeReportInvalidDates();
	});

	it('Generate Hedge Report with only one commodity selected', () => {
		cy.reportDropdown(2, commodities[0]);
		hedgeReportAssertion('hedgeReports');
	});

	it('Generate Hedge Report with two commodities selected', () => {
		cy.reportDropdown(2, commodities[0]);
		cy.get('body').click(0, 0);
		cy.reportDropdown(2, commodities[1]);
		hedgeReportAssertion('hedgeReports');
	});

	it('Generate Hedge Report with a single future month selected', () => {
		cy.reportDropdown(3, 'H23');
		hedgeReportAssertion('hedgeReports');
	});

	it('Generate Hedge Report more than one future month selected', () => {
		cy.reportDropdown(3, 'H23');
		cy.get('body').click(0, 0);
		cy.reportDropdown(3, 'K23');
		cy.get('body').click(0, 0);
		cy.reportDropdown(3, 'N23');
		hedgeReportAssertion('hedgeReports');
	});

	it('Generate Hedge Report one hedge account', () => {
		cy.reportDropdown(4, '17038182');
		hedgeReportAssertion('hedgeReports');
	});
});
