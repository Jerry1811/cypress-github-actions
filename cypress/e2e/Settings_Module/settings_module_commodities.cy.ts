import { todaySDate } from '../../fixtures/date';
import { commodities } from '../../fixtures/env.data';
import { VVV_DEMO_USER_ONE } from '../../fixtures/login.util';
import { routes } from '../../fixtures/routes';
import { randomNumber } from '../../fixtures/settings_module';
import { commodityFormInputError, editCommodity, enableDisableCommodity, fillCommodityForm, validateCommodityDateFieldError } from './_helpers/settings_helper';
import path = require('path');

describe.only('Settings Module | Commodities', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.checkRejectedHedges();
		cy.dataTestId('sidebar-item-settings').click();
		cy.dataTestId('menu-item-commodities').click();

		cy.intercept('GET', routes.commodities_filter).as('commoditiesFilter');
		cy.intercept('GET', routes.product).as('product');
		cy.intercept('PUT', routes.deactivate_commodity).as('deactivateCommodity');
		cy.intercept('PUT', routes.activate_commodity).as('activateCommodity');
		cy.intercept('PUT', routes.update_commodity).as('updateCommodity');
		cy.intercept('GET', routes.edit_commodity).as('editCommodity');
	});

	it('Verify that "Commodities" is accessible from the "Settings Module"', () => {
		cy.wait(['@commoditiesFilter', '@product']);
		cy.dataTestId('menu-item-commodities').should('have.class', 'ant-menu-item-selected');
	});

	it('Verify that a given commodity can be disabled', () => {
		enableDisableCommodity('Do you want to deactivate this commodity?', 'false', 'deactivateCommodity');
	});

	it('Verify that a given disabled commodity can be edited', () => {
		editCommodity();
	});

	it('Verify that a given commodity that was disabled can be reenabled', () => {
		enableDisableCommodity('Do you want to activate this commodity?', 'true', 'activateCommodity');
	});

	it('Verify that a given commodity can be editable', () => {
		editCommodity();
	});

	it('Verify that a new commodity can be created', () => {
		cy.get('#genericWizardForm').should('not.exist');
		cy.dataTestId('create-button').click();
		cy.get('#genericWizardForm').should('be.visible').and('exist');
	});

	it('Verify that a new commodity cannot Advance onto Crop Year without entering required fields for New Commodity', () => {
		cy.dataTestId('create-button').click();
		cy.dataTestId('wizard-button-submit').click();
		commodityFormInputError();
		cy.get('#genericWizardForm').children().eq(1).find('input').parent().parent().should('have.css', 'border-color', 'rgb(170, 23, 87)');
		cy.dataTestId('form-input-price')
			.parent()
			.parent()
			.parent()
			.parent()
			.parent()
			.find('li')
			.each($li => {
				expect($li).to.have.text('Value Required');
			});
	});

	it('Verify that new commodity cannot advance onto Crop Year with only filling out some of the required fields for New Commodity', () => {
		cy.dataTestId('create-button').click();
		cy.dataTestId('form-input-price').first().type(4);
		cy.dataTestId('form-input-price').eq(1).type(1);
		cy.get('#genericWizardForm').children().eq(1).find('input').click();
		cy.get('.ant-select-item-option-content').eq(1).click();
		cy.dataTestId('wizard-button-submit').click();
		commodityFormInputError();
	});

	it('Verify that a new commodity cannot advance onto Hedge Mapping without specifying an initial crop year', () => {
		fillCommodityForm(randomNumber, commodities[1]);
		cy.dataTestId('wizard-button-submit').click();
		validateCommodityDateFieldError('Value Required');
	});

	it('Verify that a new commodity cannot advance on to Hedge Mapping with partially filling out the start date and excluding the end date', () => {
		fillCommodityForm(randomNumber, commodities[0]);
		cy.get('.ant-picker-input-active').type(todaySDate);
		cy.get('body').click(0, 0);
		cy.dataTestId('wizard-button-submit').click({ force: true });
		validateCommodityDateFieldError('Value Required');
	});

	it('Verify that new commodity cannot advance onto Hedge Mapping when setting a date range less than 12 months', () => {
		fillCommodityForm(randomNumber, commodities[0]);
		cy.enterTwoDates(todaySDate, todaySDate);
		validateCommodityDateFieldError('Date range must be between 12 and 15 months');
	});

	it('Verify that "Hedge Mapping" template can be downloaded', () => {
		fillCommodityForm(randomNumber, commodities[1]);
		cy.enterTwoDates(todaySDate, '2024-03-09');
		cy.dataTestId('wizard-button-submit').click();
		cy.get('#genericWizardForm').find('a').click();

		const downloadsFolder = Cypress.config('downloadsFolder');
		const downloadedFilename = path.join(downloadsFolder, `Soybeans.xlsx`);
		cy.readFile(downloadedFilename, 'binary', { timeout: 15000 }).should(buffer => {
			expect(buffer.length).to.be.gt(100);
		});
	});
});
