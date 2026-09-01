import { After, Before, Status } from '@cucumber/cucumber';
import * as dotenv from 'dotenv';
import { createDriver } from '../config/driver.factory';
import { CustomWorld } from './world';

dotenv.config();

Before(async function (this: CustomWorld) {
  this.driver = createDriver();
  this.initPages();
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED) {
    const screenshot = await this.driver.takeScreenshot();
    await this.attach(screenshot, 'base64:image/png');
  }
  await this.driver.quit();
});
