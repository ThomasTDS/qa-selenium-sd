import { After, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import * as dotenv from 'dotenv';
import { createDriver } from '../config/driver.factory';
import { CustomWorld } from './world';

dotenv.config();

setDefaultTimeout(30 * 1000);

// Timeout maior que o padrão (30s): criar o driver envolve subir o browser do
// zero e, em CI, o primeiro cold-start pode ser mais lento que uma navegação comum.
Before({ timeout: 60 * 1000 }, async function (this: CustomWorld) {
  this.driver = await createDriver();
  this.initPages();
});

After(async function (this: CustomWorld, { result }) {
  if (!this.driver) {
    return;
  }
  if (result?.status === Status.FAILED) {
    const screenshot = await this.driver.takeScreenshot();
    await this.attach(screenshot, 'base64:image/png');
  }
  await this.driver.quit();
});
