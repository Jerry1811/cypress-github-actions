import { VVV_DEMO_USER_ONE } from '../fixtures/login.util';

let token: any;

describe.skip('Reset Test Automation Tenant', () => {
	before(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.intercept('GET', '/api/commodities').as('commodities');
	});

	it('reset tenant', () => {
		cy.visit('/transactions');
		cy.wait('@commodities').then(res => {
			token = res.request.headers.authorization;
			cy.request({
				method: 'GET',
				url: 'https://qas-eastus-hrvystapi-app.azurewebsites.net/api/automation/reset',
				headers: { accept: 'application/json', Authorization: token }
			}).then(res => {
				expect(res.status).to.equal(200);
			});
		});
	});
});
