import { contracts } from '../../fixtures/contracts.util';
import { currentYear, todaySDate } from '../../fixtures/date';
import { commodities, locations } from '../../fixtures/env.data';
import { VVV_DEMO_USER_ONE } from '../../fixtures/login.util';
import { routes } from '../../fixtures/routes';
import { basisPushCommons, reportAssertion } from './_helpers/reports.helper';

import path = require('path');

describe('Load Basis Push Reports', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.checkRejectedHedges();
		cy.dataTestId('sidebar-item-reports').click();
		cy.navigateToReportsAndSelectReportType('Basis Push Report');

		cy.intercept('GET', routes.commodities).as('commodities');
		cy.intercept('GET', routes.employees).as('employees');
		cy.intercept('GET', routes.contract_types).as('contractTypes');
		cy.intercept('GET', routes.locations_destination_true).as('locations');
		cy.intercept('GET', routes.crop_year).as('cropYear');
		cy.intercept('GET', routes.execute_report).as('basisReport');
		cy.intercept('GET', routes.excel_report).as('excelReport');
		cy.wait(['@commodities', '@employees', '@contractTypes', '@locations', '@cropYear']);
	});

	it('load basis push report - start and end date filter', () => {
		cy.enterTwoDates(`2022-11-20`, todaySDate);
		cy.dataTestId('submit-wrapper').click();
		cy.dataTestId('generic-table').should('exist');
	});

	it('load basis push report - without start and end dates', () => {
		cy.dataTestId('submit-wrapper').click();
		cy.get('[class$=show-help]').should('be.visible');
		cy.dataTestId('generic-table').should('not.exist');
	});

	it('load basis push report - commodity filter', () => {
		basisPushCommons(2, commodities[0], `2022-11-20`);
		reportAssertion(commodity => {
			expect(commodity.Product).to.equal(commodities[0]);
		});
	});

	it('load basis push report - crop year filter', () => {
		basisPushCommons(3, currentYear, `2022-11-20`);
		reportAssertion(cropYear => {
			if (cropYear.Crop === currentYear.toString()) {
				expect(cropYear.Crop).to.equal(currentYear.toString());
			}
		});
	});

	it('load basis push report - contract type filter', () => {
		basisPushCommons(4, contracts[0].contract, `2022-11-20`);
		reportAssertion(type => {
			if (type.contractType === contracts[0].contract) {
				expect(type.contractType).to.equal(contracts[0].contract);
			}
		});
	});

	it('load basis push report - destination filter', () => {
		basisPushCommons(5, locations[0], `2022-11-20`);
		reportAssertion(destination => {
			expect(destination.Destination).to.equal(locations[0]);
		});
	});

	it('load basis push report - employee filter', () => {
		basisPushCommons(6, 'DemoUserAdmin VVV', `2022-11-20`);
		reportAssertion(employee => {
			expect(employee.Employee).to.equal('VVVDemo11 UserAdmin1');
		});
	});

	it('export basis push report', () => {
		cy.enterTwoDates(`2022-11-20`, todaySDate);
		cy.dataTestId('submit-wrapper').click();
		cy.wait('@excelReport');
		cy.get('body')
			.wait(300)
			.then(() => {
				cy.dataTestId('excel-export-button').click();
				const downloadsFolder = Cypress.config('downloadsFolder');
				const downloadedFilename = path.join(downloadsFolder, 'Report.xlsx');
				cy.readFile(downloadedFilename, 'binary', { timeout: 5000 }).should(buffer => {
					expect(buffer.length).to.be.gt(100);
				});
			});
	});

	it('clear basis push report filters', () => {
		basisPushCommons(4, contracts[0].contract, todaySDate);
		cy.get('body')
			.wait(300)
			.then(() => {
				cy.wait('@basisReport').then(() => {
					cy.dataTestId('generic-table').should('exist');
				});
				cy.dataTestId('clear-button').click();
				cy.dataTestId('generic-table').should('not.exist');
			});
	});
});
