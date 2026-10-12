/**
 * Lê as mensagens do Cucumber (reports/cucumber-messages.ndjson) e lista os
 * cenários instáveis: os que falharam numa tentativa e só passaram depois do
 * retry. No resumo padrão do Cucumber eles aparecem como "passed", sem sinal
 * de que falharam antes.
 *
 * O resultado vai para o terminal, para reports/cenarios-instaveis.md e, no
 * GitHub Actions, para o resumo do job ($GITHUB_STEP_SUMMARY).
 *
 * Uso: npm run report:flaky
 */
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';

const MESSAGES_PATH = 'reports/cucumber-messages.ndjson';
const OUTPUT_PATH = 'reports/cenarios-instaveis.md';

interface Attempt {
  failed: boolean;
  firstError?: string;
}

interface ScenarioRun {
  name: string;
  uri: string;
  tags: string[];
  attempts: Attempt[];
}

function readScenarioRuns(path: string): ScenarioRun[] {
  const pickles = new Map<string, { name: string; uri: string; tags: string[] }>();
  const pickleByTestCase = new Map<string, string>();
  const runByTestCase = new Map<string, ScenarioRun>();
  const attemptByStarted = new Map<string, Attempt>();

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line.trim()) {
      continue;
    }
    const message = JSON.parse(line);
    if (message.pickle) {
      const { id, name, uri, tags } = message.pickle;
      pickles.set(id, { name, uri, tags: tags.map((tag: { name: string }) => tag.name) });
    } else if (message.testCase) {
      pickleByTestCase.set(message.testCase.id, message.testCase.pickleId);
    } else if (message.testCaseStarted) {
      const { id, testCaseId } = message.testCaseStarted;
      let run = runByTestCase.get(testCaseId);
      if (!run) {
        const pickle = pickles.get(pickleByTestCase.get(testCaseId) ?? '');
        run = {
          name: pickle?.name ?? testCaseId,
          // Barras normais, para o caminho sair igual no Windows e no CI (Linux).
          uri: (pickle?.uri ?? '').replace(/\\/g, '/'),
          tags: pickle?.tags ?? [],
          attempts: [],
        };
        runByTestCase.set(testCaseId, run);
      }
      const attempt: Attempt = { failed: false };
      run.attempts.push(attempt);
      attemptByStarted.set(id, attempt);
    } else if (message.testStepFinished) {
      const { testCaseStartedId, testStepResult } = message.testStepFinished;
      const attempt = attemptByStarted.get(testCaseStartedId);
      if (attempt && testStepResult.status === 'FAILED') {
        attempt.failed = true;
        attempt.firstError ??= String(testStepResult.message ?? '').split('\n')[0];
      }
    }
  }
  return [...runByTestCase.values()];
}

function buildMarkdown(runs: ScenarioRun[]): string {
  const flaky = runs.filter(
    (run) => run.attempts.length > 1 && !run.attempts[run.attempts.length - 1].failed,
  );
  const lines = ['## Cenários instáveis', ''];
  if (flaky.length === 0) {
    lines.push(`Nenhum dos ${runs.length} cenários precisou de nova tentativa para passar.`);
    return lines.join('\n') + '\n';
  }
  lines.push(
    `${flaky.length} de ${runs.length} cenários só passaram depois de repetir. ` +
      'No resumo do Cucumber eles aparecem como "passed".',
    '',
    '| Cenário | Caso | Tentativas | Erro da primeira tentativa |',
    '| --- | --- | --- | --- |',
  );
  for (const run of flaky) {
    const testCase = run.tags.filter((tag) => tag.startsWith('@TC-')).join(' ') || '—';
    const error = (run.attempts.find((attempt) => attempt.failed)?.firstError ?? '').replace(
      /\|/g,
      '\\|',
    );
    lines.push(
      `| ${run.name} (\`${run.uri}\`) | ${testCase} | ${run.attempts.length} | ${error || '—'} |`,
    );
  }
  return lines.join('\n') + '\n';
}

if (!existsSync(MESSAGES_PATH)) {
  console.error(`${MESSAGES_PATH} não encontrado. Rode a suíte antes (npm test).`);
  process.exit(1);
}

const markdown = buildMarkdown(readScenarioRuns(MESSAGES_PATH));
console.log(markdown);
writeFileSync(OUTPUT_PATH, markdown);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
}
