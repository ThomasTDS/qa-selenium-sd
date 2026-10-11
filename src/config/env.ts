import * as dotenv from 'dotenv';

// Carrega o .env aqui, no módulo que lê as variáveis, para não depender da ordem
// em que o Cucumber importa os arquivos. Antes, o dotenv rodava só no hooks.ts,
// e quem era importado antes dele (como o api-client, via account.steps) lia
// process.env sem o .env aplicado quando a suíte rodava sem paralelismo.
dotenv.config({ quiet: true });

export const env = {
  // Sem barra no final, para montar URLs como `${env.baseUrl}/products`.
  baseUrl: (process.env.BASE_URL ?? 'https://automationexercise.com').replace(/\/+$/, ''),
  browser: process.env.BROWSER ?? 'chrome',
  headless: process.env.HEADLESS === 'true',
} as const;
