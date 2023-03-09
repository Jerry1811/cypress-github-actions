import { login_email_invalid, VVV_DEMO_USER_ONE } from '../../fixtures/login.util';

const { email } = login_email_invalid;

describe('User Login - Access', () => {
	it('login to hrvyst with valid credentials', () => {
		cy.login(VVV_DEMO_USER_ONE.email, VVV_DEMO_USER_ONE.password);

		cy.log('LOGIN SUCCESSFUL');
	});

	it('login to hrvyst with invalid email', () => {
		const args = email;
		cy.visit('/');
		cy.dataTestId('login-button').click();
		cy.origin('https://login.microsoftonline.com/', { args }, email => {
			cy.get('input[type="email"]').should('be.visible').type(`${email}{enter}`);

			cy.get('#usernameError').then($emailError => {
				expect($emailError.text()).to.equal('Enter a valid email address, phone number or Skype name.');
			});
		});
	});
});
