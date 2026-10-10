import { randomUUID } from 'node:crypto';

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

// UUID em vez de Date.now(): com a suíte rodando em paralelo, dois cenários
// podem gerar a conta no mesmo milissegundo e acabar com o mesmo e-mail.
export function generateTestAccount(): TestAccount {
  const uniqueId = randomUUID();
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

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function generateContactMessage(): ContactMessage {
  return {
    name: 'QA Selenium',
    email: `qa.selenium.${randomUUID()}@example.com`,
    subject: 'Mensagem de teste automatizado',
    message: 'Mensagem enviada pelo teste E2E do formulário de contato.',
  };
}
