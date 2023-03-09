import { todaySDate } from '../../../fixtures/date';

export const noDataAssertion = () => {
	cy.get('[class$=empty]').should('exist');
	cy.get('[class$=empty-description]').should('have.text', 'No Data');
};

export const hedgeReportAssertion = hedgeReports => {
	cy.dataTestId('submit-wrapper').children().first().click();
	cy.wait('@hedgeReports').then(res => {
		hedgeReports = res.response.body.data.list[0].list;
		if (hedgeReports.length > 0) {
			cy.dataTestId('generic-table')
				.find('tbody')
				.children()
				.then($el => {
					expect($el.length - 1).to.equal(hedgeReports.length);
				});
		} else {
			noDataAssertion();
		}
	});
};

export const hedgeReportInvalidDates = () => {
	let hedgeReports: any;
	cy.dataTestId('submit-wrapper').children().first().click();
	cy.wait('@hedgeReports').then(res => {
		hedgeReports = res.response.body.data.list[0].list;
		cy.dataTestId('generic-table').should('not.exist');
		expect(hedgeReports.length).to.equal(0);
	});
};

export const dailyActivityCommons = (index: number, value: any) => {
	cy.reportDropdown(index, value);
	cy.enterTwoDates(todaySDate, todaySDate);
	cy.dataTestId('submit-wrapper').click();
};

export const basisPushCommons = (index: number, value: any, dateOne: string) => {
	cy.reportDropdown(index, value);
	cy.enterTwoDates(dateOne, todaySDate);
	cy.dataTestId('submit-wrapper').click();
};

export const reportAssertion = assertion => {
	cy.wait('@basisReport').then(res => {
		let filterRes = res.response.body.data.list[0].list;
		let removeLastObject = filterRes.pop();
		filterRes.forEach(item => assertion(item));
	});
};
