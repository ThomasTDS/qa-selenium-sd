import { Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { generateTestCard } from '../support/test-data';
import { CustomWorld } from '../support/world';

When('eu tento prosseguir para o checkout', async function (this: CustomWorld) {
  await this.cartPage.proceedToCheckout();
});

Then('devo ver a mensagem {string}', async function (this: CustomWorld, expectedMessage: string) {
  const message = await this.cartPage.getCheckoutGuardMessage();
  assert.equal(message, expectedMessage);
});

When('eu confirmo o pedido no checkout', async function (this: CustomWorld) {
  await this.checkoutPage.placeOrder();
});

When('eu pago o pedido com um cartão de teste', async function (this: CustomWorld) {
  await this.paymentPage.fillCardDetails(generateTestCard());
  await this.paymentPage.pay();
});

Then('devo ver a confirmação {string}', async function (this: CustomWorld, expectedTitle: string) {
  const title = await this.paymentPage.getOrderConfirmationTitle();
  assert.equal(title, expectedTitle);
});
