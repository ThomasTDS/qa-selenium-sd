import { After, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { createDriver } from '../config/driver.factory';
import { deleteAccount } from './api-client';
import { attachFailureDiagnostics } from './diagnostics';
import { CustomWorld } from './world';

setDefaultTimeout(30 * 1000);

// Timeout maior que o padrão (30s): criar o driver envolve subir o browser do
// zero e, em CI, o primeiro cold-start pode ser mais lento que uma navegação comum.
// Cenários @api falam só HTTP com o site, então não abrem browser.
Before({ tags: 'not @api', timeout: 60 * 1000 }, async function (this: CustomWorld) {
  this.driver = await createDriver();
  this.initPages();
});

After(async function (this: CustomWorld, { result }) {
  if (!this.driver) {
    return;
  }
  if (result?.status === Status.FAILED) {
    await attachFailureDiagnostics(this);
  }
  try {
    await this.driver.quit();
  } catch (error) {
    // Se o browser já tinha morrido, o quit() também falha; isso não deve
    // aparecer no relatório como um segundo erro do cenário.
    this.log(`Não foi possível encerrar o browser: ${String(error)}`);
  }
});

// Exclui via API a conta criada pelo cenário, mesmo que ele tenha falhado antes
// de chegar ao passo de exclusão. Se o cenário já excluiu a conta pela interface,
// a API responde 404 e não há nada a fazer.
After(async function (this: CustomWorld) {
  if (!this.testAccount) {
    return;
  }
  const { email, password } = this.testAccount;
  try {
    const { responseCode, message } = await deleteAccount(email, password);
    if (responseCode !== 200 && responseCode !== 404) {
      this.log(`Limpeza: não foi possível excluir a conta ${email} (${responseCode}: ${message})`);
    }
  } catch (error) {
    // Uma falha na limpeza não deve mudar o resultado do cenário, só ficar registrada.
    this.log(`Limpeza: erro ao excluir a conta ${email}: ${String(error)}`);
  }
});
