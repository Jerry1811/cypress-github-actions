import { contracts } from '../../fixtures/contracts.util';
import { currentYear, todaySDate } from '../../fixtures/date';
import { commodities, locations } from '../../fixtures/env.data';
import { VVV_DEMO_USER_ONE } from '../../fixtures/login.util';
import { routes } from '../../fixtures/routes';
import { dailyActivityCommons, reportAssertion } from './_helpers/reports.helper';
import path = require('path');

describe('Load Daily Activity Reports', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.checkRejectedHedges();
		cy.dataTestId('sidebar-item-reports').click();
		cy.navigateToReportsAndSelectReportType('Daily Activity');
		cy.intercept('GET', routes.commodities).as('commodities');
		cy.intercept('GET', routes.transaction_events_report).as('events');
		cy.intercept('GET', routes.employees).as('employees');
		cy.intercept('GET', routes.contract_types).as('contractTypes');
		cy.intercept('GET', routes.locations_destination_true).as('locations');
		cy.intercept('GET', routes.crop_year).as('cropYear');
		cy.intercept('GET', routes.execute_report).as('basisReport');
		cy.intercept('GET', routes.excel_report).as('excelReport');
		cy.wait(['@commodities', '@events', '@employees', '@contractTypes', '@locations', '@cropYear']);
	});

	it('load daily activity report - start and end date filter', () => {
		cy.enterTwoDates(todaySDate, todaySDate);
		cy.dataTestId('submit-wrapper').click();
		cy.dataTestId('generic-table').should('exist');
	});

	it('load daily activity report - without start and end dates', () => {
		cy.dataTestId('submit-wrapper').click();
		cy.get('[class$=show-help]').should('be.visible');
		cy.dataTestId('generic-table').should('not.exist');
	});

	it('load daily activity report - commodity filter', () => {
		dailyActivityCommons(2, commodities[0]);
		reportAssertion(commodity => {
			expect(commodity.Product).to.equal(commodities[0]);
		});
	});

	it('load daily activity report - crop year filter', () => {
		dailyActivityCommons(3, currentYear);
		reportAssertion(cropYear => {
			expect(cropYear.Crop).to.equal(currentYear.toString());
		});
	});

	it('load daily activity report - events filter', () => {
		dailyActivityCommons(4, 'Create');
		cy.wait('@basisReport').then(res => {
			expect(res.response.statusCode).to.equal(200);
		});
	});

	it('load daily activity report - contract type filter', () => {
		dailyActivityCommons(5, contracts[0].contract);
		reportAssertion(contractType => {
			expect(contractType.contractType).to.equal(contracts[0].contract);
		});
	});

	it('load daily activity report - destination filter', () => {
		dailyActivityCommons(6, locations[0]);
		reportAssertion(destination => {
			expect(destination.Destination).to.equal(locations[0]);
		});
	});

	it('load daily activity report - employee filter', () => {
		dailyActivityCommons(7, 'DemoUserAdmin VVV');
		reportAssertion(employee => {
			expect(employee.Employee).to.equal('VVVDemo11 UserAdmin1');
		});
	});

	it('export daily activity report', () => {
		cy.enterTwoDates(todaySDate, todaySDate);
		cy.dataTestId('submit-wrapper').click();
		cy.wait('@excelReport');
		cy.get('body')
			.wait(300)
			.then($body => {
				if ($body.find('[data-testid=excel-export-button]').length) {
					cy.dataTestId('excel-export-button').click();

					const downloadsFolder = Cypress.config('downloadsFolder');
					const downloadedFilename = path.join(downloadsFolder, 'Report.xlsx');
					cy.readFile(downloadedFilename, 'binary', { timeout: 5000 }).should(buffer => {
						expect(buffer.length).to.be.gt(100);
					});
				}
			});
	});

	it('clear daily activity report filters', () => {
		dailyActivityCommons(4, 'Create');
		cy.wait('@basisReport');
		cy.get('body')
			.wait(300)
			.then($body => {
				if ($body.find('[data-testid=excel-export-button]').length) {
					cy.dataTestId('generic-table').should('exist');
					cy.dataTestId('clear-button').click();
					cy.dataTestId('generic-table').should('not.exist');
				}
			});
	});
});
