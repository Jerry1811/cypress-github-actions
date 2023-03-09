import { commodities } from '../../../fixtures/env.data';
import { VVV_DEMO_USER_ONE } from '../../../fixtures/login.util';
import { routes } from '../../../fixtures/routes';

let filteredCommodity: any, customerNumber: any, filteredCustomer: any, filteredContractType: any;

describe('Contracts - Filter', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.checkRejectedHedges();

		cy.intercept('GET', '/api/customer?name=yaw').as('customers');
		cy.intercept('POST', routes.contracts_filter).as('contractsFilter');
	});

	it('filter by commodity', () => {
		cy.wait('@contractsFilter');
		cy.checkRejectedHedges();
		cy.dataTestId('filter-multiple').first().click();
		cy.get(`div[label="${commodities[0]}"]`).contains(commodities[0]).click();
		cy.dataTestId('filter-multiple').should('contain.text', commodities[0]);
		cy.wait('@contractsFilter').then(contractCommodity => {
			filteredCommodity = contractCommodity.response.body.data.list;
			filteredCommodity.map(filteredCom => {
				expect(filteredCom.commodity).to.equal(commodities[0]);
			});
		});
	});

	it('filter by customer', () => {
		cy.wait('@contractsFilter');
		cy.checkRejectedHedges();
		cy.dataTestId('filter-multiple').parent().siblings().eq(0).type('yaw');
		cy.wait('@customers');
		cy.selectOptionFromDropdown();
		cy.wait('@contractsFilter').then(customer => {
			filteredCustomer = customer.response.body.data.list;
			cy.get('p[class*="text--small"]')
				.first()
				.then($el => {
					customerNumber = $el.text();
					filteredCustomer.map(customer => {
						expect(customer.customer.number).to.equal(customerNumber);
					});
				});
		});
	});

	it('filter by contract type', () => {
		cy.wait('@contractsFilter');
		cy.checkRejectedHedges();
		cy.intercept('POST', routes.contracts_filter).as('filterResults');
		cy.dataTestId('filter-single').first().click();
		cy.dataTestId('filter-single-Basis').click();
		cy.dataTestId('filter-single').first().should('contain.text', 'Basis');
		cy.wait('@filterResults').then(contractType => {
			filteredContractType = contractType.response.body.data.list;
			filteredContractType.map(contract => {
				expect(contract.contract.type).to.equal('Basis');
			});
		});
	});
});
