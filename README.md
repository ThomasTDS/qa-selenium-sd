# QA Selenium SD

[![E2E Tests](https://github.com/ThomasTDS/qa-selenium-sd/actions/workflows/e2e.yml/badge.svg)](https://github.com/ThomasTDS/qa-selenium-sd/actions/workflows/e2e.yml)

Testes end-to-end usando **Selenium WebDriver**, **TypeScript** e **Cucumber** (BDD), seguindo o padrão **Page Object Model (POM)**.

Site alvo: [Automation Exercise](https://automationexercise.com)

## Cobertura atual

- Login (formulários exibidos, tentativa de login inválida)
- Carrinho (adicionar produto, remover produto, carrinho vazio)
- Checkout sem estar logado (bloqueio esperado)
- Cadastro de usuário (criação e exclusão de conta, e-mail já existente, e 7 campos obrigatórios em branco via `Scenario Outline`)
- Checkout completo estando logado (carrinho → checkout → pagamento → confirmação do pedido)
- Tentativa de pagamento sem preencher os dados do cartão (bloqueio esperado)

Cada cenário que cria uma conta de teste também a exclui ao final, para não deixar dados de teste acumulados no site.

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

- Node.js 22, 24 ou 26+ (exigido pelo `@cucumber/cucumber`)
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

Todo push e pull request para `master` dispara o workflow [`e2e.yml`](.github/workflows/e2e.yml): um job `quality` roda lint e type-check e, se passar, um job `e2e` roda a suíte completa em modo headless numa matrix (Chrome e Edge), publicando o relatório de cada browser como artefato do job.

## Notas técnicas

- O site alvo é monetizado com anúncios que podem sobrepor elementos e até interceptar navegações (interstitials). Para evitar flakiness, o `driver.factory.ts` bloqueia os domínios de anúncio via Chrome DevTools Protocol (CDP) logo após criar o driver.
- `BasePage.click()` faz scroll até o elemento e, se o clique nativo for interceptado, tenta um clique via JavaScript como fallback.

## Bug reports

Bugs reais encontrados durante o desenvolvimento (na aplicação sob teste, na infraestrutura de CI ou no próprio código de automação) são documentados como [Issues](https://github.com/ThomasTDS/qa-selenium-sd/issues?q=is%3Aissue+label%3Abug) usando o [template de bug report](.github/ISSUE_TEMPLATE/bug_report.md), com passos para reproduzir, evidências, causa raiz e a correção aplicada.
