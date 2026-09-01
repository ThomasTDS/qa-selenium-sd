# QA Selenium SD

Testes end-to-end usando **Selenium WebDriver**, **TypeScript** e **Cucumber** (BDD), seguindo o padrão **Page Object Model (POM)**.

Site alvo: [Automation Exercise](https://automationexercise.com)

## Estrutura do projeto

```
src/
├── config/     # configuração do WebDriver (browser, headless, timeouts)
├── pages/      # page objects
├── features/   # especificações em Gherkin (.feature)
├── steps/      # step definitions
├── support/    # world e hooks do Cucumber
└── utils/      # utilitários compartilhados
```

## Pré-requisitos

- Node.js 20+
- Google Chrome instalado

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

## Qualidade de código

```bash
npm run lint
npm run format
```
