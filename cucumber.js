module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'],
    paths: ['src/features/**/*.feature'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
    ],
    publishQuiet: true,
    // O site alvo fica atrás do Cloudflare, que ocasionalmente trata o IP de
    // datacenter dos runners de CI como suspeito e bloqueia/atrasa a resposta
    // de forma intermitente. Retry absorve essa flakiness de ambiente sem
    // mascarar falhas reais (uma regressão de verdade falha em todas as tentativas).
    retry: 2,
  },
};
