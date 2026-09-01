# QA Selenium SD

[![E2E Tests](https://github.com/ThomasTDS/qa-selenium-sd/actions/workflows/e2e.yml/badge.svg)](https://github.com/ThomasTDS/qa-selenium-sd/actions/workflows/e2e.yml)

Testes end-to-end usando **Selenium WebDriver**, **TypeScript** e **Cucumber** (BDD), seguindo o padrão **Page Object Model (POM)**.

Site alvo: [Automation Exercise](https://automationexercise.com)

## Estrutura do projeto

```
src/
├── config/     # configuração do WebDriver (browser, headless, timeouts)
├── pages/      # page objects
├── features/   # especificações em Gherkin (.feature)
├── steps/      # step definitions
└── support/    # world e hooks do Cucumber
```

## Pré-requisitos

- Node.js 20+
- Google Chrome instalado (ou Microsoft Edge, veja `BROWSER` abaixo)

## Instalação

```bash
npm install
cp .env.example .env
```

## Executando os testes

```bash
npm test              # com browser visível
npm run test:headless # em modo headless
```

Relatórios são gerados em `reports/` (HTML e JSON).

### Variáveis de ambiente (`.env`)

| Variável   | Padrão                          | Descrição                          |
| ---------- | -------------------------------- | ----------------------------------- |
| `BASE_URL` | `https://automationexercise.com` | URL base da aplicação sob teste     |
| `BROWSER`  | `chrome`                         | `chrome` ou `edge`                  |
| `HEADLESS` | `false`                          | `true` para rodar sem interface     |

## Qualidade de código

```bash
npm run lint
npm run format
```

## Integração contínua

Todo push e pull request para `master` dispara o workflow [`e2e.yml`](.github/workflows/e2e.yml), que instala as dependências, roda lint, type-check e a suíte de testes em modo headless no Chrome, publicando o relatório como artefato do job.
