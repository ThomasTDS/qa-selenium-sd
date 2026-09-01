export interface TestAccount {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export function generateTestAccount(): TestAccount {
  const uniqueId = Date.now();
  return {
    name: 'QA Selenium',
    email: `qa.selenium.${uniqueId}@example.com`,
    password: 'Teste@123',
    firstName: 'QA',
    lastName: 'Selenium',
    address: 'Rua de Teste, 123',
    country: 'Canada',
    state: 'Ontario',
    city: 'Toronto',
    zipcode: '12345',
    mobileNumber: '11987654321',
  };
}

export interface TestCard {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export function generateTestCard(): TestCard {
  return {
    nameOnCard: 'QA Selenium',
    cardNumber: '4111111111111111',
    cvc: '123',
    expiryMonth: '05',
    expiryYear: '2030',
  };
}
