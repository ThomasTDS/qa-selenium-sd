const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const REQUEST_TIMEOUT = 10000;

export interface ApiResponse {
  responseCode: number;
  message: string;
}

/**
 * A API do Automation Exercise sempre responde HTTP 200 e coloca o status real
 * no campo `responseCode` do corpo (ex.: 200 = excluída, 404 = não encontrada).
 */
export async function deleteAccount(email: string, password: string): Promise<ApiResponse> {
  const response = await fetch(`${BASE_URL}/api/deleteAccount`, {
    method: 'DELETE',
    body: new URLSearchParams({ email, password }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });
  return (await response.json()) as ApiResponse;
}
