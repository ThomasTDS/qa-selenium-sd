import { After, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import * as dotenv from 'dotenv';
import { createDriver } from '../config/driver.factory';
import { deleteAccount } from './api-client';
import { CustomWorld } from './world';

dotenv.config();

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
    try {
      const screenshot = await this.driver.takeScreenshot();
      await this.attach(screenshot, 'base64:image/png');
    } catch {
      // Se a sessão do browser já estiver travada, a captura de tela também trava.
      // Não deixamos isso impedir a tentativa de encerrar o driver logo abaixo.
    }
  }
  await this.driver.quit();
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
