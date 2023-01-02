import { contracts } from '../../fixtures/contracts_flat_price.util';
import { login_valid } from '../../fixtures/login.util';

const { email, password } = login_valid;
let contractStatus;

describe('Buy HTA Contracts', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/contracts/filter').as('contracts');
    cy.intercept('GET', '/api/customer?name=a').as('customers');
    cy.intercept('POST', '/api/contracts').as('contractSubmitted');
    cy.intercept('PUT', '/api/reviewandrelease/approve').as('approveContract');

    cy.login(email, password);
    cy.wait('@contracts');
    cy.clickAwayAlert();
  });

  contracts.forEach(contract => {
    if (contract === contracts[1]) {
      it(`Buy HTA Contracts ${contract} - No Accumulations`, () => {
        cy.dataTestId('sidebar-item-settings').click();
        cy.dataTestId('menu-item-bypassReview').click();
        cy.get('button[type="button"]').eq(2).as('bypassToggle');
        cy.get('@bypassToggle').then($btn => {
          if (contract === contracts[0] && $btn[0].ariaChecked === 'false') {
            cy.log('Bypass turned off for already');
          } else if (
            contract === contracts[0] &&
            $btn[0].ariaChecked === 'true'
          ) {
            // turn off toggle
            cy.get('@bypassToggle').click();
            cy.dataTestId('form-button-submit').click();
          } else if (
            contract === contracts[1] &&
            $btn[0].ariaChecked === 'false'
          ) {
            // turn on toggle
            cy.get('@bypassToggle')
              .click()
              .then(() => {
                //   cy.get('.bypass-form-body')
                //     .children()
                //     .eq(1)
                //     .children()
                //     .eq(1)
                //     .should('be.visible')
                //     .click();
                //   cy.dataTestId('form-button-submit').click();
              });
          }
        });

        // cy.dataTestId('sidebar-item-transactions')
        //   .click()
        //   .then(() => {
        //     cy.url().should('include', '/transactions');
        //   });
        // cy.clickAwayAlert();
        // cy.dataTestId('create-new-entry-button')
        //   .first()
        //   .click()
        //   .then(() => {
        //     cy.dataTestId('create-contract-button').click();
        //   });

        // cy.get('#contract-group')
        //   .children()
        //   .first()
        //   .click()
        //   .type('HTA')
        //   .then(() => {
        //     cy.get('.ant-select-item-option-content').contains('HTA').click();
        //   });
        // cy.dataTestId('commodity-input-item')
        //   .click()
        //   .type('Corn')
        //   .then(() => {
        //     cy.get('.ant-select-item-option-content').contains('Corn').click();
        //   });
        // cy.dataTestId('location-form-item')
        //   .click()
        //   .type('Craig')
        //   .then(() => {
        //     cy.get('.ant-select-item-option-content').contains('Craig').click();
        //   });
        // cy.get('[name="deliveryLocation"]')
        //   .click()
        //   .type('Test Location')
        //   .then(() => {
        //     cy.get('.ant-select-item-option-content')
        //       .contains('Test Location')
        //       .click();
        //   });
        // // TO-DO select dates
        // cy.dataTestId('form-input-test').eq(2).type(5000);

        // cy.dataTestId('customer-form-item')
        //   .children()
        //   .eq(1)
        //   .type('a')
        //   .then(() => {
        //     cy.wait('@customers');
        //     cy.get('[class$=option-content]').eq(3).click({ force: true });
        //   });

        // submit contract
        // cy.dataTestId('create-new-modal-btn').click();
        // cy.wait('@contractSubmitted');
      });
    }
  });
});

