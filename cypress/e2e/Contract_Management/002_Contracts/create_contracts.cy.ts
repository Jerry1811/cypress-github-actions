import { bypassToggle, contracts, hedgeStatus } from '../../../fixtures/contracts.util';
import { todaySDate } from '../../../fixtures/date';
import { commodities, locations } from '../../../fixtures/env.data';
import { VVV_DEMO_USER_ONE } from '../../../fixtures/login.util';
import { contractsBeforeEach } from './_helpers/helper';

let contractStatus, hrvystID;

describe('Contracts', () => {
	beforeEach(() => {
		contractsBeforeEach(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);
	});

	contracts.forEach(contract => {
		bypassToggle.forEach(toggle => {
			it(`${contract.type} ${contract.contract} Contracts ${toggle} - No Accumulations`, () => {
				cy.dataTestId('sidebar-item-settings').click();
				cy.dataTestId('menu-item-bypassReview').click();
				cy.wait(['@employeesTag', '@settingsTag']);
				cy.dataTestId('bypass-form-switch').eq(1).as('bypassToggle');
				cy.get('@bypassToggle').then($btn => {
					if (toggle === bypassToggle[0] && $btn[0].ariaChecked === 'false') {
						cy.log('Bypass turned off already');
					} else {
						cy.get('@bypassToggle').click();
						cy.dataTestId('form-button-submit').click();
						cy.wait('@bypassToggleChanged');
					}
				});

				cy.dataTestId('sidebar-item-transactions').click();
				cy.url().should('include', '/transactions');
				cy.wait('@contracts');
				cy.checkRejectedHedges();
				cy.dataTestId('create-new-entry-button').first().click();
				cy.dataTestId('create-contract-button').click();
				cy.get('#contract-group').children().first().click();
				cy.get(`div[label="${contract.contract}"]`).click();
				if (contract.type === 'Sell') {
					cy.get('input[type="radio"]').eq(1).click({ force: true });
				} else {
					cy.get('input[type="radio"]').eq(0).click({ force: true });
				}

				cy.dataTestId('commodity-input-item').type(commodities[0]);
				cy.selectOptionFromDropdown();
				cy.dataTestId('location-form-item').children().eq(1).click();
				cy.get('.ant-select-item-option-content').contains(locations[0]).click();
				cy.dataTestId('deliveryLocation-form-item').children().eq(1).click();
				cy.get(`div[label="${locations[0]}"]`).eq(1).click();
				if (contract.contract === 'HTA') {
					cy.enterTwoDates(todaySDate, todaySDate);
					cy.dataTestId('futures-month-input').click();
					cy.get('.ant-select-item-option-content').contains('K23').click();
				} else {
					cy.wait('@deliveryDates');
					cy.get('[name="deliveryDateWindow"]').children().first().children().first().click();
					cy.selectOptionFromDropdown();
				}

				cy.dataTestId('form-input-test').eq(2).type(5000);
				if (contract.contract === 'Flat Price' || contract.contract === 'HTA') {
					cy.dataTestId('futures-price-icon').click({ force: true });
					cy.wait('@futuresPrice');
				}
				cy.dataTestId('customer-form-item').children().eq(1).type('yaw');
				cy.wait('@customers');
				cy.get('[class^="ant-select-dropdown"]').contains('yaw').click();
				cy.dataTestId('employee-form-item').children().eq(1).type('a');
				cy.wait('@employees');
				cy.selectOptionFromDropdown();

				// submit contract
				cy.dataTestId('create-new-modal-btn').click();
				cy.wait('@contracts').then(res => {
					contract.status === 'Priced' ? expect(res.response.body.data.list[0].status).to.equal('Priced') : expect(res.response.body.data.list[0].status).to.equal('Open');
				});
				cy.wait(['@contracts', '@reviewReleaseStatus', '@reviewReleaseFilter']);
				cy.checkRejectedHedges();
				cy.wait('@contractSubmitted').then(res => {
					cy.get('tr')
						.eq(2)
						.children()
						.eq(4)
						.children()
						.find('span[class$="text--bold"]')
						.then($el => {
							hrvystID = $el.text();
							expect(res.response.body.data).to.equal(hrvystID);
						});
				});
				cy.checkRejectedHedges();
				if (contract.contract === 'Flat Price' || contract.contract === 'HTA') {
					cy.contains('Review & Release').click();
					cy.wait(['@reviewReleaseFilter', '@reviewReleaseFuturesMonth', '@reviewReleaseStatus']);
					cy.checkRejectedHedges();
					cy.dataTestId('table-column').eq(2).children().children().first().children().first().as('contractStatusColumnField');

					if (toggle === bypassToggle[0]) {
						cy.get('@contractStatusColumnField').then(
							/* @ts-ignore */
							($p: { innerText: string }[]) => {
								expect($p[0].innerText).to.equal('Ready');
							}
						);

						cy.checkRejectedHedges();
						cy.dataTestId('table-column').parent().parent().eq(0).children().first().find('input[type="checkbox"]').click();
						cy.checkRejectedHedges();
						cy.dataTestId('button-approve')
							.click()
							.then(() => {
								cy.checkRejectedHedges();
								cy.wait('@approveContract');
								cy.reload();
								cy.checkRejectedHedges();
								cy.contains('Review & Release').click();
								cy.checkRejectedHedges();
							});
					}
					cy.get('@contractStatusColumnField').then(
						/* @ts-ignore */
						($p: { innerText: string }[]) => {
							contractStatus = $p[0].innerText;
							if (contractStatus === hedgeStatus[0]) {
								expect(hedgeStatus[0]).to.equal(contractStatus);
							} else if (contractStatus === hedgeStatus[1]) {
								expect(hedgeStatus[1]).to.equal(contractStatus);
							} else if (contractStatus === hedgeStatus[2]) {
								expect(hedgeStatus[2]).to.equal(contractStatus);
							}
						}
					);
				}
			});
		});
	});
});
