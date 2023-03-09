import { VVV_DEMO_USER_ONE } from '../../fixtures/login.util';
import { activateDeactivateUser, checkPagination, clickSettingsTabs, ERP, fillCustomerForm, filter, firstname, invalidFilter, searchUser } from './_helpers/settings_helper';

describe.only('Settings Module | Customers', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.checkRejectedHedges();
		cy.dataTestId('sidebar-item-settings').click();

		cy.intercept('GET', '/api/settings/userdefaultvalues').as('defaultPage');
		cy.intercept('GET', '/api/employees/filter**').as('employeesFilter');
		cy.intercept('GET', '/api/roles').as('roles');
		cy.intercept('GET', '/api/commodities/filter').as('commoditiesFilter');
		cy.intercept('POST', '/api/locations/filter').as('locationsFilter');
		cy.intercept('GET', '/api/ordermetadataconfigurations**').as('orderEntry');
		cy.intercept('GET', '/api/commodities').as('commodities');
		cy.intercept('POST', '/api/bidsheets/filter').as('bidsheets');
		cy.intercept('GET', '/api/servicefee').as('serviceFee');
		cy.intercept('GET', '/api/settings/tag50', '/api/employees/tag50').as('bypassReview');
		cy.intercept('GET', '/api/settings/erpintegration').as('erp');
		cy.intercept('GET', '/api/customer/filter**').as('customerFilter');
		cy.intercept('POST', '/api/customer').as('customer');
		cy.intercept('GET', '/api/customer?name=**').as('customers');
	});

	it('Verify that "Settings" is accessible for those users who have valid permissions', () => {
		cy.location().should(loc => {
			expect(loc.pathname).to.equal('/settings');
		});
	});

	it('Verify that "Settings" is accessible for those users who have valid permissions/access to all settings', () => {
		cy.dataTestId('menu-item-customers').should('have.class', 'ant-menu-item-selected');
		clickSettingsTabs('menu-item-employees', 'employeesFilter');
		clickSettingsTabs('menu-item-commodities', 'commoditiesFilter');
		clickSettingsTabs('menu-item-locations', 'locationsFilter');
		clickSettingsTabs('menu-item-orderEntry', 'orderEntry');
		clickSettingsTabs('menu-item-users', 'roles');
		cy.dataTestId('menu-item-brokerMapping').click();
		cy.dataTestId('menu-item-brokerMapping').should('have.class', 'ant-menu-item-selected');
		clickSettingsTabs('menu-item-hedgeMapping', 'commodities');
		cy.dataTestId('menu-item-roundingRules').click();
		cy.dataTestId('menu-item-roundingRules').should('have.class', 'ant-menu-item-selected');
		clickSettingsTabs('menu-item-bidsheet', 'bidsheets');
		clickSettingsTabs('menu-item-serviceFees', 'serviceFee');
		clickSettingsTabs('menu-item-bypassReview', 'bypassReview');
		clickSettingsTabs('menu-item-erpIntegration', 'erp');
		clickSettingsTabs('menu-item-defaultPage', 'defaultPage');
	});

	it('Verify that adding a new customer is possible', () => {
		cy.dataTestId('button-create-customers').click();
		fillCustomerForm();
		cy.dataTestId('create-customer-modal-btn').click();
		cy.wait('@customer').then(res => {
			expect(res.response.statusCode).to.equal(200);
			expect(res.response.body.data).to.equal(ERP);
			cy.checkToastMessage('Success');
		});
	});

	it('Verify that filtering by customer name is possible given the available customers - Valid Customer', () => {
		filter('customerFilter', firstname);
		cy.wait('@customerFilter').then(res => {
			cy.get('tr').eq(2).children().as('firstRow');
			cy.get('@firstRow').eq(2).find('p').should('contain', firstname);
			expect(res.response.body.data.list[0].firstName).to.equal(firstname);
		});
	});

	it('Verify that filtering by ERP # is possible given the available customers - Valid ERP #', () => {
		filter('customerFilter', ERP);
		cy.wait('@customerFilter').then(res => {
			cy.get('tr').eq(2).children().as('firstRow');
			cy.get('@firstRow').eq(1).find('p').should('have.text', ERP);
			expect(res.response.body.data.list[0].number).to.equal(ERP);
		});
	});

	it('Verify that filtering by customer name is possible given the available customers - Invalid Customer', () => {
		invalidFilter('customerFilter', 'gimmick');
	});

	it('Verify that filtering by ERP # is possible given the available customers - Invalid ERP #', () => {
		invalidFilter('customerFilter', '7653234');
	});

	it('Verify that adding a new customer can be cancelled', () => {
		cy.intercept('POST', '/api/customer', cy.spy().as('apiNotCalled'));
		cy.dataTestId('button-create-customers').click();
		fillCustomerForm();
		cy.get('button[type="button"]').contains('Cancel').click();
		cy.get('@apiNotCalled').should('not.have.been.called');
	});

	it('Verify that "Add Customer" button is only displayed when required fields are filled out', () => {
		cy.dataTestId('button-create-customers').click();
		cy.dataTestId('create-customer-modal-btn').should('be.disabled');
		fillCustomerForm();
		cy.dataTestId('create-customer-modal-btn').should('be.enabled');
	});

	it('Verify that user can "X" out of the "Add New Customer" modal', () => {
		cy.intercept('POST', '/api/customer', cy.spy().as('apiNotCalled'));
		cy.dataTestId('button-create-customers').click();
		fillCustomerForm();
		cy.get('button[class="ant-modal-close"]').click();
		cy.get('@apiNotCalled').should('not.have.been.called');
		cy.get('[class$="create-customer-modal"]').should('not.exist');
	});

	it('Verify that user can cancel from deactivating a customer', () => {
		cy.intercept('PUT', '/api/customer/deactivate**', cy.spy().as('cancelDeactivate'));
		filter('customerFilter', firstname);
		cy.dataTestId('popconfirm-trigger').click();
		cy.dataTestId('popconfirm-cancel').click();
		cy.get('@cancelDeactivate').should('not.have.been.called');
		searchUser(firstname, 'customer-form-item');
		cy.wait('@customers').then(() => {
			cy.get('.ant-select-item-option-content').should('contain.text', firstname);
			cy.get('[class$="warning-message"]').should('not.exist');
		});
	});

	it('Verify that user can deactivate a customer', () => {
		cy.intercept('PUT', '/api/customer/deactivate**').as('deactivateCustomer');
		activateDeactivateUser(firstname, 'customerFilter', 'deactivateCustomer', 'customer-form-item');
		cy.wait('@customers').then(() => {
			cy.get('.ant-form-item-explain').find('[class$="warning-message"]').should('have.text', 'Unavailable choice');
		});
	});

	it('Verify that user can activate a deactivated Customer', () => {
		cy.intercept('PUT', '/api/customer/activate**').as('activateCustomer');
		activateDeactivateUser(firstname, 'customerFilter', 'activateCustomer', 'customer-form-item');
		cy.wait('@customers').then(() => {
			cy.get('.ant-select-item-option-content').should('contain.text', firstname);
			cy.get('[class$="warning-message"]').should('not.exist');
		});
	});

	it('Verify that user can page through more than one page when data is presented that pagination occurs', () => {
		checkPagination('customerFilter');
	});
});
