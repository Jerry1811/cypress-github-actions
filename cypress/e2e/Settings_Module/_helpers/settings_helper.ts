import { create_customer } from '../../../fixtures/settings_module';

export const { ERP, firstname, lastname, cellPhone, address, city, state, zipCode, country, email } = create_customer;

export const filter = (alias: any, input: string) => {
	cy.wait(`@${alias}`, { timeout: 40000 });
	cy.dataTestId('filter-input').type(`${input}{enter}`);
};

export const fillCommodityForm = (ERP: string, commodityName: string): void => {
	cy.dataTestId('create-button').click();
	cy.dataTestId('form-input-test').first().type(ERP);
	cy.dataTestId('form-input-test').eq(1).type(commodityName);
	cy.dataTestId('form-input-price').first().type(4);
	cy.dataTestId('form-input-price').eq(1).type(1);
	cy.get('#genericWizardForm')
		.children()
		.eq(1)
		.find('input')
		.click()
		.then(() => {
			cy.get('.ant-select-item-option-content').eq(1).click();
		});
	cy.dataTestId('wizard-button-submit').click();
};

export const enableDisableCommodity = (message: string, triggerState: string, alias: string) => {
	cy.dataTestId('confirm-dialog-switch-trigger').eq(0).click();
	cy.dataTestId('default-icon').siblings().first().find('label').should('have.text', message);
	cy.wait('@product');
	cy.dataTestId('popconfirm-apply').click();
	cy.wait(`@${alias}`).its('response.statusCode').should('eq', 200);
	cy.dataTestId('confirm-dialog-switch-trigger').first().should('have.attr', 'aria-checked', triggerState);
};

export const editCommodity = () => {
	cy.dataTestId('edit-button').first().click();
	cy.wait(['@editCommodity', '@product']);
	cy.dataTestId('form-input-test').should('have.attr', 'disabled');
	cy.dataTestId('form-input-price').first().clear().type(3);
	cy.dataTestId('form-input-price').eq(1).clear().type(2);
	cy.dataTestId('wizard-button-submit').click();
	cy.wait('@updateCommodity');
	cy.checkToastMessage('Success');
};

export const commodityFormInputError = () => {
	cy.dataTestId('form-input-test').should('have.css', 'border-color', 'rgb(170, 23, 87)');
};

export const validateCommodityDateFieldError = errorMessage => {
	cy.dataTestId('row-cropDatePicker').children().eq(1).find('li').should('have.text', errorMessage);
};

// activate/deactivate a customer/employee
export const activateDeactivateUser = (firstname: string, alias1: string, alias2: string, dataTestId: string) => {
	filter(alias1, firstname);
	cy.dataTestId('popconfirm-trigger').click();
	cy.dataTestId('popconfirm-apply').click();
	cy.wait(`@${alias2}`).its('response.statusCode').should('equal', 200);
	searchUser(firstname, dataTestId);
};

export const invalidFilter = (alias: string, input: string) => {
	filter(alias, input);
	cy.dataTestId('filter-empty').find('p').should('have.text', `We couldn\'t find a match for "${input}", \n Please try again another search.`);
};

export const fillCustomerForm = () => {
	cy.dataTestId('form-input-test').first().type(ERP);
	cy.dataTestId('form-input-test').eq(1).type(firstname);
	cy.dataTestId('form-input-test').eq(2).type(lastname);
	cy.dataTestId('form-input-test').eq(3).type(cellPhone);
	cy.dataTestId('form-input-test').eq(4).type(address);
	cy.dataTestId('form-input-test').eq(5).type(city);
	cy.dataTestId('form-input-test').eq(6).type(zipCode);
	cy.dataTestId('form-input-test').eq(7).type(email);
	cy.dataTestId('state-form-item').click();
	cy.get('.ant-select-item-option-content').contains(state).click();
	cy.dataTestId('country-form-item').click();
	cy.get('.ant-select-item-option-content').contains(country).click();
};

// search customer/employee on create contract form
export const searchUser = (userName: string, dataTestId: string) => {
	cy.dataTestId('create-new-entry-button').first().click();
	cy.dataTestId('create-contract-button').click();
	cy.dataTestId(dataTestId).children().eq(1).type(userName);
};

export const clickSettingsTabs = (dataTestId: string, alias: string) => {
	cy.dataTestId(dataTestId).click();
	cy.wait(`@${alias}`).its('response.statusCode').should('eq', 200);
	cy.dataTestId(dataTestId).should('have.class', 'ant-menu-item-selected');
};

export const fillEmployeeForm = (ERP, firstname, lastname, email) => {
	cy.wait('@employeesFilter');
	cy.get('button[type="button"]').contains('Create Employee').click();
	cy.dataTestId('form-input-test').first().type(ERP);
	cy.dataTestId('form-input-test').eq(1).type(firstname);
	cy.dataTestId('form-input-test').eq(2).type(lastname);
	cy.dataTestId('name').siblings().eq(1).find('.ant-select-selector').click();
	cy.get('div[label="Administrator"]').click();
	cy.dataTestId('form-input-test').eq(3).type(email);
};

export const checkPagination = (alias: string) => {
	cy.wait(`@${alias}`);
	cy.get('li[class$="pagination-options"]').click();
	cy.get('div[class$="item-option-content"]').first().click();
	cy.get('li[class$="pagination-next"]').click();
	cy.get('li[class$="pagination-prev"]').should('have.attr', 'aria-disabled', 'false').click();
};
