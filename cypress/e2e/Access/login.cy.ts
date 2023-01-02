import {
  login_email_invalid,
  login_password_invalid,
  login_valid,
} from '../../fixtures/login.util';

const { email } = login_email_invalid;

describe('User Login - Access', () => {
  it('login to hrvyst with valid credentials', () => {
    cy.login(login_valid.email, login_valid.password);

    cy.log('User logged in successfully');
  });

  it('login to hrvyst with invalid email', () => {
    const args = { email };
    cy.visit('/');
    cy.dataTestId('login-button')
      .click()
      .then(() => {
        cy.origin(
          'https://login.microsoftonline.com/',
          { args },
          ({ email }) => {
            cy.get('input[type="email"]')
              .should('be.visible')
              .type(`${email}{enter}`);

            cy.get('#usernameError').then($emailError => {
              expect($emailError.text()).to.equal(
                'Enter a valid email address, phone number or Skype name.',
              );
            });
          },
        );
      });
  });

  it('login to hrvyst with valid email and invalid password', () => {
    const { email, password } = login_password_invalid;
    const args = { email, password };
    cy.visit('/');
    cy.dataTestId('login-button')
      .click()
      .then(() => {
        cy.origin(
          'https://login.microsoftonline.com/',
          { args },
          ({ email, password }) => {
            cy.get('input[type="email"]')
              .should('be.visible')
              .type(`${email}{enter}`);
            cy.get('input[type="password"]')
              .should('be.visible')
              .type(`${password}{enter}`, { log: false });

            cy.get('#passwordError').then($passwordError => {
              expect($passwordError.text()).to.equal(
                "Your account or password is incorrect. If you can't remember your password, reset it now.",
              );
            });
          },
        );
      });
  });
});
