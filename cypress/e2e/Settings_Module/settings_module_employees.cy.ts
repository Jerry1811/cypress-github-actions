import { VVV_DEMO_USER_ONE } from '../../fixtures/login.util';
import { create_customer, employee_data, randomUsername } from '../../fixtures/settings_module';
import { activateDeactivateUser, checkPagination, fillEmployeeForm, filter, invalidFilter, searchUser } from './_helpers/settings_helper';

const { ERP, firstname, lastname, email } = create_customer;
let new_firstname;

describe.only('Settings Module | Employees', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.checkRejectedHedges();
		cy.dataTestId('sidebar-item-settings').click();
		cy.dataTestId('menu-item-employees').click();

		cy.intercept('GET', '/api/employees/filter**').as('employeesFilter');
		cy.intercept('GET', '/api/employees?name**').as('employees');
		cy.intercept('POST', '/api/employees').as('addEmployee');
		cy.intercept('PUT', '/api/employees**').as('updateEmployee');
		cy.intercept('PUT', '/api/employees/deactivate**').as('deactivateEmployee');
	});

	it('Verify that user can navigate to "Employees" via "Customers" page via the Settings Module', () => {
		cy.dataTestId('menu-item-employees').should('have.class', 'ant-menu-item-selected');
	});

	it('Verify a new employee can be added when all required fields are entered', () => {
		fillEmployeeForm(ERP, firstname, lastname, email);
		cy.dataTestId('form-button-submit').click();
		cy.wait('@addEmployee').its('response.statusCode').should('equal', 200);
		cy.checkToastMessage('Success');
	});

	it('Verify that Tag50 for an existing employee can be enabled', () => {
		filter('employeesFilter', firstname);
		cy.dataTestId('table-button-actions').click();
		cy.dataTestId('edit-button').click();
		cy.dataTestId('name').siblings().eq(3).find('button').click();
		cy.dataTestId('form-button-submit').should('have.attr', 'disabled');
		cy.dataTestId('form-input-tag50Account').should('be.visible');
	});

	it('Verify that user can filter by ERP #', () => {
		filter('employeesFilter', ERP);
		cy.wait('@employeesFilter').then(res => {
			cy.get('tr').eq(2).children().as('firstRow');
			cy.get('@firstRow').eq(1).find('p').should('have.text', ERP);
			expect(res.response.body.data.list[0].number).to.equal(ERP);
		});
	});

	it('Verify that user cannot filter by an invalid ERP #', () => {
		invalidFilter('employeesFilter', 'VVVINVALID');
	});

	it('Verify that user can filter by First Name', () => {
		filter('employeesFilter', firstname);
		cy.wait('@employeesFilter').then(res => {
			cy.get('tr').eq(2).children().as('firstRow');
			cy.get('@firstRow').eq(2).find('p').should('contain', firstname);
			expect(res.response.body.data.list[0].firstName).to.equal(firstname);
		});
	});

	it('Verify that user cannot filter by an invalid Last Name', () => {
		invalidFilter('employeesFilter', 'Cunningham');
	});

	it('Verify that user can filter by Last Name', () => {
		filter('employeesFilter', lastname);
		cy.wait('@employeesFilter').then(res => {
			cy.get('tr').eq(2).children().as('firstRow');
			cy.get('@firstRow').eq(3).find('p').should('contain', lastname);
			expect(res.response.body.data.list[0].lastName).to.equal(lastname);
		});
	});

	it('Verify that user cannot filter by an invalid First Name', () => {
		invalidFilter('employeesFilter', 'Hawkins');
	});

	it('Verify that "Add New Employee" Modal is accessible', () => {
		cy.get('[class$=generic-modal-form]').should('not.exist');
		cy.get('button[type="button"]').contains('Create Employee').click();
		cy.get('[class$=generic-modal-form]').should('be.visible').and('exist');
	});

	it('Verify that error messages are thrown when "Add Employee" button is clicked without entering information into the form', () => {
		cy.wait('@employeesFilter');
		cy.get('button[type="button"]').contains('Create Employee').click();
		cy.dataTestId('form-button-submit').click();
		cy.dataTestId('name').siblings().eq(1).find('.ant-select-selector').should('have.css', 'border-color', 'rgb(170, 23, 87)');
		cy.get('.ant-form-item-explain').should('have.length', 5);
		cy.dataTestId('form-input-test').should('have.css', 'border-color', 'rgb(170, 23, 87)').and('have.length', 4);
	});

	new_firstname = 'Shantone_' + randomUsername;

	it('Verify that Name can be edited/modified', () => {
		filter('employeesFilter', firstname);
		cy.dataTestId('table-button-actions').click();
		cy.dataTestId('edit-button').click();
		cy.dataTestId('form-input-test')
			.eq(1)
			.clear()
			.type('Shantone_' + randomUsername);
		cy.dataTestId('form-input-test')
			.eq(2)
			.clear()
			.type('HRVYST_' + randomUsername);

		cy.dataTestId('form-button-submit').click();
		cy.wait('@updateEmployee').its('response.statusCode').should('eq', 200);
		cy.checkToastMessage('Success');
	});

	it('Verify that Email can be edited/modified', () => {
		filter('employeesFilter', new_firstname);
		cy.dataTestId('table-button-actions').click();
		cy.dataTestId('edit-button').click();
		cy.dataTestId('form-input-test')
			.eq(3)
			.clear()
			.type('shantone' + randomUsername + '@hrvysthedge.com');

		cy.dataTestId('form-button-submit').click();
		cy.wait('@updateEmployee').its('response.statusCode').should('eq', 200);
		cy.checkToastMessage('Success');
	});

	it('Verify that Tag50 for an existing employee can be enabled', () => {
		filter('employeesFilter', new_firstname);
		cy.dataTestId('table-button-actions').click();
		cy.dataTestId('edit-button').click();
		cy.dataTestId('name').siblings().eq(3).find('button').click();
		cy.dataTestId('form-button-submit').should('have.attr', 'disabled');
		cy.dataTestId('form-input-tag50Account').should('be.visible');
	});

	it('Verify a new employee with Tag50 can be added when all required fields are entered', () => {
		fillEmployeeForm(employee_data.ERP, employee_data.firstname, employee_data.lastname, employee_data.email);
		cy.dataTestId('name').siblings().eq(3).find('button').click();
		cy.dataTestId('form-input-tag50Account').type('HRVYST' + employee_data.ERP);
		cy.dataTestId('form-button-submit').click();
		cy.wait('@addEmployee').its('response.statusCode').should('equal', 200);
		cy.checkToastMessage('Success');

		filter('employeesFilter', employee_data.firstname);
		cy.dataTestId('table-button-actions').click();
		cy.dataTestId('edit-button').click();
		cy.dataTestId('name').siblings().eq(3).find('button').should('have.attr', 'aria-checked', 'true');
	});

	it('Verify that adding a new employee can be cancelled without saving', () => {
		cy.intercept('POST', '/api/employees', cy.spy().as('addEmployee'));
		fillEmployeeForm(ERP, firstname, lastname, email);
		cy.dataTestId('form-button-cancel').click();
		cy.get('@addEmployee').should('not.have.been.called');
	});

	it('Verify that "Add New Employee" Modal can be closed/cancelled once accessed', () => {
		cy.wait('@employeesFilter');
		cy.get('button[type="button"]').contains('Create Employee').click();
		cy.get('[class$=generic-modal-form]').should('be.visible').and('exist');
		cy.dataTestId('form-button-cancel').click();
		cy.get('[class$=generic-modal-form]').should('not.exist');
	});

	it('Verify that ERP ID is not editable', () => {
		filter('employeesFilter', 'VVVDemo11');
		cy.dataTestId('table-button-actions').click();
		cy.dataTestId('edit-button').click();
		cy.dataTestId('form-input-test').first().should('have.attr', 'disabled');
	});

	it('Verify that user can cancel deactivation of an employee', () => {
		filter('employeesFilter', new_firstname);
		cy.dataTestId('confirm-dialog-switch-trigger').click();
		cy.dataTestId('popconfirm-cancel').click();
		cy.dataTestId('confirm-dialog-switch-trigger').should('have.attr', 'aria-checked', 'true');
		searchUser(new_firstname, 'employee-form-item');
		cy.wait('@employees').then(() => {
			cy.get('.ant-select-item-option-content').should('contain.text', new_firstname);
			cy.get('[class$="warning-message"]').should('not.exist');
		});
	});

	it('Verify that user can deactivate an employee', () => {
		activateDeactivateUser(new_firstname, 'employeesFilter', 'deactivateEmployee', 'employee-form-item');
		cy.wait('@employees').then(() => {
			cy.get('.ant-form-item-explain').find('[class$="warning-message"]').should('have.text', 'Unavailable choice');
		});
	});

	it('Verify default pagination', () => {
		cy.wait('@employeesFilter');
		cy.get('li[class$="pagination-options"]').find('span[class$="selection-item"]').should('have.text', '50 / page');
	});

	it('Verify that if multiple pages of records exist that user can page through the pages', () => {
		checkPagination('employeesFilter');
	});
});
