# QA Selenium SD

[![E2E Tests](https://github.com/ThomasTDS/qa-selenium-sd/actions/workflows/e2e.yml/badge.svg)](https://github.com/ThomasTDS/qa-selenium-sd/actions/workflows/e2e.yml)

[Último relatório de testes publicado](https://thomastds.github.io/qa-selenium-sd/)

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

Cada cenário é identificado e rastreável via tag `@TC-XXX`, listados em [`docs/test-cases.md`](docs/test-cases.md) junto com módulo, tipo, prioridade e status de automação. Os fluxos ponta-a-ponta mais críticos têm a tag `@smoke` (`npx cucumber-js --tags @smoke`).

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

A suíte roda em 2 workers em paralelo (configurado em `cucumber.js`), reduzindo o tempo total de execução em quase a metade sem abrir muitas sessões de browser simultâneas.

### Rodando via Docker

Não precisa de Node nem Chrome instalados localmente — só Docker:

```bash
docker build -t qa-selenium-sd .
docker run --rm qa-selenium-sd
```

A imagem já vem com o Google Chrome instalado e as variáveis `BROWSER=chrome`/`HEADLESS=true` configuradas.

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

## Convenção de commits

O projeto segue [Conventional Commits](https://www.conventionalcommits.org/): `tipo: descrição breve` (ex.: `feat: adiciona cenário de recuperação de senha`).

Tipos aceitos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Aplicado via [commitlint](https://commitlint.js.org/) + [husky](https://typicode.github.io/husky/): o hook `commit-msg` roda automaticamente após `npm install` (script `prepare`) e bloqueia qualquer commit fora do padrão.

## Integração contínua

Todo push e pull request para `master` dispara o workflow [`e2e.yml`](.github/workflows/e2e.yml): um job `quality` roda lint e type-check e, se passar, um job `e2e` roda a suíte completa em modo headless no Chrome, publicando o relatório como artefato do job. O Edge continua suportado para execução local (veja `BROWSER` acima), mas foi removido da matrix de CI por instabilidade recorrente no runner — detalhes na Issue de bug report correspondente.

Em todo push direto para `master` (não em pull requests), um terceiro job publica o relatório HTML mais recente no GitHub Pages: [thomastds.github.io/qa-selenium-sd](https://thomastds.github.io/qa-selenium-sd/).

Um job `docker` (disparado manualmente via `workflow_dispatch`, não em todo push) builda a imagem e roda a suíte dentro do container, validando que o `Dockerfile` continua funcionando.

## Notas técnicas

- O site alvo é monetizado com anúncios que podem sobrepor elementos e até interceptar navegações (interstitials). Para evitar flakiness, o `driver.factory.ts` bloqueia os domínios de anúncio via Chrome DevTools Protocol (CDP) logo após criar o driver.
- `BasePage.click()` faz scroll até o elemento e, se o clique nativo for interceptado, tenta um clique via JavaScript como fallback.
- O site alvo fica atrás do Cloudflare, que ocasionalmente trata o IP de datacenter dos runners de CI como suspeito, causando falhas intermitentes que não reproduzem localmente. O `cucumber.js` configura `retry: 2` para absorver essa flakiness de ambiente sem mascarar regressões reais (que falham em todas as tentativas).

## Bug reports

Bugs reais encontrados durante o desenvolvimento (na aplicação sob teste, na infraestrutura de CI ou no próprio código de automação) são documentados como [Issues](https://github.com/ThomasTDS/qa-selenium-sd/issues?q=is%3Aissue+label%3Abug) usando o [template de bug report](.github/ISSUE_TEMPLATE/bug_report.md), com passos para reproduzir, evidências, causa raiz e a correção aplicada.
