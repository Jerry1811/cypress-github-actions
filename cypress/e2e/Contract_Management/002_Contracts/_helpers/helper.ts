import { routes } from '../../../../fixtures/routes';

export const contractsBeforeEach = (email: string, password: string) => {
	cy.intercept('POST', routes.contracts_filter).as('contracts');
	cy.intercept('GET', '/api/customer?name=yaw').as('customers');
	cy.intercept('GET', '/api/employees?name=a').as('employees');
	cy.intercept('POST', routes.contracts).as('contractSubmitted');
	cy.intercept('PUT', routes.review_release_approve).as('approveContract');
	cy.intercept('GET', routes.employees_tag50).as('employeesTag');
	cy.intercept('GET', routes.settings_tag50).as('settingsTag');
	cy.intercept('PUT', routes.settings_tag50).as('bypassToggleChanged');
	cy.intercept('GET', '/api/bidsheets/**').as('deliveryDates');
	cy.intercept('GET', '/api/futures/**').as('futuresPrice');
	cy.intercept('POST', routes.review_release_filter).as('reviewReleaseFilter');
	cy.intercept('GET', routes.review_release_futures_month).as('reviewReleaseFuturesMonth');
	cy.intercept('GET', routes.review_release_status).as('reviewReleaseStatus');

	cy.login(email, password);
	cy.wait(['@contracts', '@reviewReleaseStatus']);
	cy.checkRejectedHedges();
};
