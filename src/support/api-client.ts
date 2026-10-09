import { TestAccount } from './test-data';

const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const REQUEST_TIMEOUT = 10000;

export interface ApiResponse {
  responseCode: number;
  message: string;
}

/**
 * A API do Automation Exercise sempre responde HTTP 200 e coloca o status real
 * no campo `responseCode` do corpo (ex.: 201 = criada, 200 = excluída,
 * 404 = não encontrada).
 */
async function request(
  method: string,
  path: string,
  params: Record<string, string>,
): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    body: new URLSearchParams(params),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });
  return (await response.json()) as ApiResponse;
}

export async function createAccount(account: TestAccount): Promise<ApiResponse> {
  return request('POST', '/api/createAccount', {
    name: account.name,
    email: account.email,
    password: account.password,
    title: 'Mr',
    birth_date: '10',
    birth_month: 'May',
    birth_year: '1995',
    firstname: account.firstName,
    lastname: account.lastName,
    company: '',
    address1: account.address,
    address2: '',
    country: account.country,
    zipcode: account.zipcode,
    state: account.state,
    city: account.city,
    mobile_number: account.mobileNumber,
  });
}

export async function deleteAccount(email: string, password: string): Promise<ApiResponse> {
  return request('DELETE', '/api/deleteAccount', { email, password });
}
