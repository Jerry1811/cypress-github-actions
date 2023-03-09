import { todaySDate } from '../../../fixtures/date';
import { commodities } from '../../../fixtures/env.data';
import { VVV_DEMO_USER_ONE } from '../../../fixtures/login.util';
import { routes } from '../../../fixtures/routes';

let filteredCustomer: any;

const offerAssertion = assertion => {
	cy.wait('@offersFilter').then(res => {
		let filteredResults = res.response.body.data.list;
		filteredResults.forEach(item => assertion(item));
	});
};

describe('Offers - Filter', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.intercept('POST', routes.offers_filter).as('offersFilter');
		cy.intercept('POST', routes.contracts_filter).as('contracts');
		cy.intercept('GET', '/api/bidsheets/**').as('deliveryDates');
		cy.intercept('GET', '/api/customer?name=yaw').as('customers');
		cy.intercept('GET', '/api/offers/orphanscount').as('orphansCount');
		cy.checkRejectedHedges();
		cy.get('#rc-tabs-0-tab-offers').click();
		cy.wait('@offersFilter');
		cy.checkRejectedHedges();
	});

	it('filter by commodity', () => {
		cy.dataTestId('filter-multiple').eq(2).click();
		cy.get('[class$="label--bold"]').contains('Corn').click();
		cy.dataTestId('filter-multiple').should('contain.text', commodities[0]);
		offerAssertion(filteredCom => {
			expect(filteredCom.commodity).to.equal('Corn');
		});
	});

	it('filter by status', () => {
		cy.intercept('POST', routes.offers_filter).as('offersResults');
		cy.dataTestId('filter-single').eq(5).click();
		cy.dataTestId('filter-single-Filled').click();
		offerAssertion(filteredStat => {
			expect(filteredStat.status).to.equal('Filled');
		});
	});

	it('filter by customer', () => {
		cy.dataTestId('filter-multiple').parent().siblings().eq(10).type('yaw');
		cy.wait('@customers');
		cy.selectOptionFromDropdown();
		cy.wait('@offersFilter').then(filteredCustomerOffers => {
			filteredCustomer = filteredCustomerOffers.response.body.data.list;
			cy.get('p[class*="text--small"]')
				.last()
				.then($el => {
					let customerNumber = $el.text();
					filteredCustomer.forEach(customer => {
						expect(customer.customer.number).to.equal(customerNumber);
					});
				});
		});
	});

	it('filter by futures M/Y', () => {
		cy.dataTestId('filter-multiple').parent().siblings().eq(11).as('FMY');
		cy.get('@FMY').then(() => {
			cy.wait(5000);
			cy.checkRejectedHedges();
		});
		cy.get('@FMY').click();
		cy.get('.ant-select-item-option-content').find('span').contains('K23').click();
		offerAssertion(filterFuture => {
			expect(filterFuture.price.futuresMonth).to.equal('K23');
		});
	});

	it('filter by date', () => {
		cy.dataTestId('filter-date').click().type(`${todaySDate}{enter}`);
		cy.wait('@offersFilter').then(filterResults => {
			// to be worked on when issue with date filter is fixed
			cy.log('Returned results');
		});
	});
});
