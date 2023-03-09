import { VVV_DEMO_USER_ONE } from '../../../fixtures/login.util';

let rejectedHedges: any, orderNumber: any;

describe('Resend Hedge', () => {
	before(() => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
		cy.get('[id$=reviewAndRelease]').first().click();
		cy.checkRejectedHedges();
		cy.get('.ant-picker-clear').click();
	});

	it('resend hedge', () => {
		cy.intercept('POST', '/api/reviewandrelease/filter').as('filterState');
		cy.intercept('PUT', '/api/reviewandrelease/resend').as('resendHedge');
		cy.dataTestId('filter-multiple').eq(1).click();
		cy.get('div[label="Rejected"]').find('label').click();

		cy.wait('@filterState').then(res => {
			rejectedHedges = res.response.body.data.list;
			rejectedHedges.some(hedge => {
				if (hedge.typeName === 'Market' && hedge.restrictions.canBeResent === true) {
					orderNumber = hedge.orderNumber;
					cy.dataTestId('filter-input').eq(2).type(`${orderNumber}{enter}`);
					return hedge.orderNumber;
				}
			});
		});
		cy.wait('@filterState');
		cy.get('body')
			.wait(300)
			.then($body => {
				if ($body.find('[data-testid=table-column]').length) {
					cy.dataTestId('table-column').find('button[type="button"]').first().click();
					cy.dataTestId('resend-button').click();
					cy.wait('@resendHedge').then(resendRes => {
						cy.get('[class$=notice-message]').should('have.text', 'Order Successfully Resent');
						expect(resendRes.response.body.data.totalProcessedTransactions).to.equal(1);
						expect(resendRes.response.body.data.errors.length).to.equal(0);
					});
				}
			});
	});
});
