export const randomNumber = new Date().getTime().toString().slice(7, 13);
export const randomUsername = Math.random().toString(36).substring(7);

export const create_customer = {
	ERP: randomNumber,
	firstname: 'Shanton_' + randomUsername,
	lastname: 'HrvystTester',
	cellPhone: new Date().getTime(),
	address: 'Osford Street',
	city: 'Oslo',
	state: 'Arkansas',
	zipCode: '00233',
	country: 'United States',
	email: 'shanton' + randomUsername + '@hrvysthedge.com'
};

export const employee_data = {
	ERP: new Date().getTime().toString().slice(6, 13),
	firstname: 'Shanton ' + new Date().getTime().toString().slice(6, 13),
	lastname: 'HrvystTester',
	email: 'shanton' + new Date().getTime() + '@hrvysthedge.com'
};
