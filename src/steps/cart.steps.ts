import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { CustomWorld } from '../support/world';

Given('que estou na página de produtos', async function (this: CustomWorld) {
  await this.productsPage.goto();
});

Given(
  'que adicionei o produto {string} ao carrinho',
  async function (this: CustomWorld, productName: string) {
    await this.productsPage.addProductToCart(productName);
  },
);

When(
  'eu adiciono o produto {string} ao carrinho',
  async function (this: CustomWorld, productName: string) {
    await this.productsPage.addProductToCart(productName);
  },
);

When('eu vou para o carrinho', async function (this: CustomWorld) {
  await this.cartPage.goto();
});

When(
  'eu removo o produto {string} do carrinho',
  async function (this: CustomWorld, productName: string) {
    await this.cartPage.removeProduct(productName);
  },
);

Then(
  'o produto {string} deve estar no carrinho',
  async function (this: CustomWorld, productName: string) {
    const hasProduct = await this.cartPage.hasProduct(productName);
    assert.equal(hasProduct, true);
  },
);

Then('o carrinho deve estar vazio', async function (this: CustomWorld) {
  const isEmpty = await this.cartPage.isEmpty();
  assert.equal(isEmpty, true);
});
