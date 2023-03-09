import { todaySDate } from '../../../fixtures/date';
import { VVV_DEMO_USER_ONE } from '../../../fixtures/login.util';

let filteredResults: any, orderNumber: any, accountNumber: any, futuresMonth: any, firstSymbol: any;

const reviewReleaseAssertion = assertion => {
	cy.wait('@reviewFilter').then(res => {
		filteredResults = res.response.body.data.list;
		filteredResults.forEach(item => assertion(item));
	});
};

describe('Review & Release - Filter', () => {
	beforeEach(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.get('[id$=reviewAndRelease]').first().click();
		cy.checkRejectedHedges();
		cy.intercept('POST', '/api/reviewandrelease/filter').as('filterState');
		cy.get('.ant-picker-clear').click();

		cy.wait('@filterState').then(res => {
			accountNumber = res.response.body.data.list[0].accountNumber;
			futuresMonth = res.response.body.data.list[0].futuresMonth;
			firstSymbol = res.response.body.data.list[0].symbol.code;
			const contracts = res.response.body.data.list;
			contracts.some(contract => {
				if (contract.orderNumber !== '' && contract.orderNumber !== null) {
					orderNumber = contract.orderNumber;
					return contract.orderNumber;
				}
			});
		});
	});

	it('filter by hedge state', () => {
		cy.wait('@filterState');
		cy.checkRejectedHedges();
		cy.intercept('POST', '/api/reviewandrelease/filter').as('reviewFilter');
		cy.dataTestId('filter-multiple')
			.eq(1)
			.click()
			.then(() => {
				cy.get('div[label="Filled"]').find('label').click();
			});
		reviewReleaseAssertion(filledHedge => {
			expect(filledHedge.status).to.equal('Filled');
		});
	});

	it('filter by start date', () => {
		cy.wait('@filterState');
		cy.checkRejectedHedges();
		cy.intercept('POST', '/api/reviewandrelease/filter').as('reviewFilter');
		cy.get('.ant-picker-input').first().type(`${todaySDate}{enter}`);
		cy.wait('@reviewFilter').then(startDates => {
			filteredResults = startDates.response.body.data.list;
			expect(filteredResults.length).to.be.greaterThan(0);
		});
	});

	it('filter by end date', () => {
		cy.wait('@filterState');
		cy.checkRejectedHedges();
		cy.intercept('POST', '/api/reviewandrelease/filter').as('reviewFilter');
		cy.get('.ant-picker-input').eq(1).type(`${todaySDate}{enter}`);
		cy.wait('@reviewFilter').then(endDates => {
			filteredResults = endDates.response.body.data.list;
			expect(filteredResults.length).to.be.greaterThan(0);
		});
	});

	it('filter by account #', () => {
		cy.wait('@filterState');
		cy.checkRejectedHedges();
		cy.intercept('POST', '/api/reviewandrelease/filter').as('reviewFilter');
		cy.dataTestId('filter-input').eq(1).type(`${accountNumber}{enter}`);
		reviewReleaseAssertion(accountNum => {
			expect(accountNum.accountNumber).to.equal(accountNumber);
		});
	});

	it('filter by order #', () => {
		cy.wait('@filterState');
		cy.checkRejectedHedges();
		cy.intercept('POST', '/api/reviewandrelease/filter').as('reviewFilter');
		cy.dataTestId('filter-input').eq(2).type(`${orderNumber}{enter}`);
		reviewReleaseAssertion(orderNum => {
			expect(orderNum.orderNumber).to.equal(orderNumber);
		});
	});

	it('filter by futures month', () => {
		cy.wait('@filterState');
		cy.checkRejectedHedges();
		cy.intercept('POST', '/api/reviewandrelease/filter').as('reviewFilter');
		cy.dataTestId('filter-multiple').eq(2).click();
		cy.get('.ant-select-item-option-content').find('span').contains(futuresMonth).click();
		reviewReleaseAssertion(futuresMon => {
			expect(futuresMon.futuresMonth).to.equal(futuresMonth);
		});
	});

	it('filter by symbol', () => {
		cy.wait('@filterState');
		cy.checkRejectedHedges();
		cy.intercept('POST', '/api/reviewandrelease/filter').as('reviewFilter');
		cy.dataTestId('filter-multiple').eq(3).click();
		cy.get('.ant-select-item-option-content').find('span').contains(firstSymbol).click();
		reviewReleaseAssertion(symbol => {
			expect(symbol.symbol.code).to.equal(firstSymbol);
		});
	});
});
