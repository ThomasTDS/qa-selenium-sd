import { TestAccount } from './test-data';

const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const REQUEST_TIMEOUT = 10000;

/**
 * A API do Automation Exercise sempre responde HTTP 200 e coloca o status real
 * no campo `responseCode` do corpo (ex.: 201 = criada, 200 = excluída,
 * 404 = não encontrada). O restante do corpo varia por endpoint (`message`,
 * `products`, `brands`, `user`...).
 */
export interface ApiResponse {
  responseCode: number;
  message?: string;
  [field: string]: unknown;
}

/**
 * Envia uma requisição para `/api<path>`. Em GET os parâmetros vão na query
 * string; nos demais métodos, no corpo como formulário (é o que a API espera).
 */
export async function apiRequest(
  method: string,
  path: string,
  params: Record<string, string> = {},
): Promise<ApiResponse> {
  const query = new URLSearchParams(params);
  const isGet = method === 'GET';
  const hasQuery = isGet && Object.keys(params).length > 0;
  const url = `${BASE_URL}/api${path}${hasQuery ? `?${query}` : ''}`;
  const response = await fetch(url, {
    method,
    body: isGet ? undefined : query,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });
  return (await response.json()) as ApiResponse;
}

function accountParams(account: TestAccount): Record<string, string> {
  return {
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
  };
}

export async function createAccount(account: TestAccount): Promise<ApiResponse> {
  return apiRequest('POST', '/createAccount', accountParams(account));
}

export async function updateAccount(account: TestAccount): Promise<ApiResponse> {
  return apiRequest('PUT', '/updateAccount', accountParams(account));
}

export async function deleteAccount(email: string, password: string): Promise<ApiResponse> {
  return apiRequest('DELETE', '/deleteAccount', { email, password });
}
