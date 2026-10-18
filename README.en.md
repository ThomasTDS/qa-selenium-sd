# QA Selenium SD

[Português](README.md) · **English**

[![E2E Tests](https://github.com/ThomasTDS/qa-selenium-sd/actions/workflows/e2e.yml/badge.svg)](https://github.com/ThomasTDS/qa-selenium-sd/actions/workflows/e2e.yml)

[Latest published test report](https://thomastds.github.io/qa-selenium-sd/)

End-to-end tests using **Selenium WebDriver**, **TypeScript** and **Cucumber** (BDD), following the **Page Object Model (POM)** pattern.

Target site: [Automation Exercise](https://automationexercise.com)

The project's primary language is Brazilian Portuguese: scenarios are written in Gherkin in Portuguese, and the internal docs ([test cases](docs/test-cases.md), [changelog](CHANGELOG.md)) are in Portuguese. This README is the English version of [`README.md`](README.md).

## Current coverage

- Login (forms displayed, successful login, invalid login attempt, logout)
- Products (search by name, search with no results, product details)
- Cart (add product, remove product, empty cart, quantity and total per item, quantities add up when the same product is added again)
- Checkout without being logged in (expected block)
- Contact form (submission with attachment, cancellation in the confirmation dialog, required email)
- Footer newsletter (subscription from the home page and the cart via `Scenario Outline`, invalid email)
- User signup (account creation and deletion, existing email, and 7 blank required fields via `Scenario Outline`)
- Full checkout while logged in (cart → checkout → payment → order confirmation)
- Payment attempt without filling in the card details (expected block)
- The site's public API, without opening a browser (`@api`): product and brand listing, search, unsupported methods, login verification, account lookup and update, already registered email

When the account is only a precondition (checkout, existing email), it is created through the API (`POST /api/createAccount`) instead of the form, which makes the scenario faster and less brittle. Every test account is deleted at the end of the scenario by an `After` hook that calls the site's API (`DELETE /api/deleteAccount`). Since the hook runs even when the scenario fails, no accounts pile up on the site. The signup scenario (`@TC-009`) still deletes the account through the UI, because deletion is part of what it tests.

Each scenario is identified and traceable through an `@TC-XXX` tag, listed in [`docs/test-cases.md`](docs/test-cases.md) (in Portuguese) along with module, type, priority and automation status. The most critical end-to-end flows have the `@smoke` tag and run on their own with `npm run test:smoke`, for a quick check before opening a PR. CI still runs the full suite on every PR.

## Project structure

```
src/
├── config/     # environment variables (env.ts) and WebDriver creation
├── pages/      # page objects
├── features/   # Gherkin specifications (.feature)
├── steps/      # step definitions
└── support/    # Cucumber world and hooks, test data and the site's API client
```

## Prerequisites

- Node.js 22, 24 or 26+ (required by `@cucumber/cucumber`)
- Google Chrome installed (or Microsoft Edge, see `BROWSER` below)

## Installation

```bash
npm install
cp .env.example .env
```

## Running the tests

```bash
npm test              # with a visible browser
npm run test:headless # in headless mode
npm run test:smoke    # @smoke scenarios only (quick check)
npm run test:api      # API tests only, no browser
```

Reports are generated in `reports/` (HTML and JSON). When a UI scenario fails, the report gets the screenshot, the URL, the page HTML (`pagina.html`) and the browser console logs (`console.log`) from the moment of the failure, so a CI failure can be investigated from the report alone.

Scenarios that fail and only pass after a retry show up as "passed" in the Cucumber summary. So that flakiness doesn't go unnoticed, they get a "Cenário instável" (flaky scenario) note in the HTML report, and `npm run report:flaky` generates a table listing all of them in `reports/cenarios-instaveis.md`. In CI, that table appears in the job summary.

The suite runs on 2 parallel workers (configured in `cucumber.js`), cutting the total run time almost in half without opening too many browser sessions at once.

### Running with Docker

No local Node or Chrome needed — just Docker:

```bash
docker build -t qa-selenium-sd .
docker run --rm qa-selenium-sd
```

The image comes with Google Chrome installed and `BROWSER=chrome`/`HEADLESS=true` already set.

### Environment variables (`.env`)

| Variable   | Default                          | Description                         |
| ---------- | -------------------------------- | ----------------------------------- |
| `BASE_URL` | `https://automationexercise.com` | Base URL of the application under test |
| `BROWSER`  | `chrome`                         | `chrome` or `edge`                  |
| `HEADLESS` | `false`                          | `true` to run without a UI          |

All variables are read in a single place, [`src/config/env.ts`](src/config/env.ts), which also loads `.env`. The rest of the code imports `env` instead of reading `process.env` directly.

## Code quality

```bash
npm run lint
npm run format
```

## Commit convention

The project follows [Conventional Commits](https://www.conventionalcommits.org/): `type: short description` (e.g. `feat: adiciona cenário de recuperação de senha`). Commit messages are written in Portuguese.

Accepted types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Enforced through [commitlint](https://commitlint.js.org/) + [husky](https://typicode.github.io/husky/): the `commit-msg` hook is installed automatically after `npm install` (`prepare` script) and blocks any commit that doesn't follow the convention.

## Changelog

[`CHANGELOG.md`](CHANGELOG.md) (in Portuguese) is generated from the commits (`npm run changelog`) and only covers history since Conventional Commits was adopted — earlier commits are not included. Only `feat` and `fix` appear in the changelog; other types are treated as internal details.

## Continuous integration

Every push and pull request to `master` triggers the [`e2e.yml`](.github/workflows/e2e.yml) workflow: a `quality` job runs lint and type-check and, if it passes, an `e2e` job runs the full suite in headless Chrome, publishing the report as a job artifact. Edge is still supported for local runs (see `BROWSER` above), but it was removed from the CI matrix because of recurring instability on the runner — details in the corresponding bug report Issue.

The workflow also runs every day at 06:17 (Brasília time), even without new commits. The target site is third-party and can change at any time, and the daily run shows when one of its changes breaks a flow, without waiting for the next PR. If it fails, GitHub sends an email. GitHub disables scheduled runs on public repositories with no activity for 60 days; if that happens, re-enable the workflow in the Actions tab.

On every direct push to `master` and on every daily run (not on pull requests), a third job publishes the latest HTML report to GitHub Pages: [thomastds.github.io/qa-selenium-sd](https://thomastds.github.io/qa-selenium-sd/).

A `docker` job (triggered manually via `workflow_dispatch`, not on every push) builds the image and runs the suite inside the container, checking that the `Dockerfile` still works.

`master` is protected: it only receives changes through pull requests, with the `quality` and `e2e (chrome)` checks passing and the branch up to date with `master`.

## Dependency maintenance

[Dependabot](.github/dependabot.yml) checks weekly for updates to the `npm` dependencies and to the actions used in the CI workflow, opening a pull request for each available update.

Major TypeScript bumps are ignored: the current `@typescript-eslint/eslint-plugin` only supports up to version 6.1, so a new major version would break the installation. The rule will be removed from `dependabot.yml` once that dependency catches up.

## Technical notes

- The target site is monetized with ads that can cover elements and even intercept navigation (interstitials). To avoid flakiness, `driver.factory.ts` blocks the ad domains through the Chrome DevTools Protocol (CDP) right after creating the driver.
- `BasePage.click()` scrolls to the element and, if the native click is intercepted, falls back to a JavaScript click.
- The target site sits behind Cloudflare, which occasionally treats the CI runners' datacenter IP as suspicious, causing intermittent failures that don't reproduce locally. `cucumber.js` sets `retry: 2` to absorb this environment flakiness without masking real regressions (which fail on every attempt).

## Bug reports

Real bugs found during development (in the application under test, in the CI infrastructure or in the automation code itself) are documented as [Issues](https://github.com/ThomasTDS/qa-selenium-sd/issues?q=is%3Aissue+label%3Abug) using the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md), with steps to reproduce, evidence, root cause and the fix applied.
