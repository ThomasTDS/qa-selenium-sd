import { Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { CustomWorld } from '../support/world';

When('eu tento prosseguir para o checkout', async function (this: CustomWorld) {
  await this.cartPage.proceedToCheckout();
});

Then('devo ver a mensagem {string}', async function (this: CustomWorld, expectedMessage: string) {
  const message = await this.cartPage.getCheckoutGuardMessage();
  assert.equal(message, expectedMessage);
});
