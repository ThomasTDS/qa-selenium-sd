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

When(
  'eu adiciono {int} unidades do produto ao carrinho',
  async function (this: CustomWorld, quantity: number) {
    await this.productDetailsPage.addToCart(quantity);
  },
);

When('eu continuo comprando', async function (this: CustomWorld) {
  await this.productsPage.continueShopping();
});

Then(
  'o produto {string} deve estar no carrinho com quantidade {int}',
  async function (this: CustomWorld, productName: string, expectedQuantity: number) {
    const quantity = await this.cartPage.getProductQuantity(productName);
    assert.equal(quantity, expectedQuantity);
  },
);

// O total é calculado a partir do preço exibido, então o cenário continua válido
// se o preço do produto mudar no site.
Then(
  'o total do produto {string} deve ser o preço unitário vezes a quantidade',
  async function (this: CustomWorld, productName: string) {
    const price = await this.cartPage.getProductPrice(productName);
    const quantity = await this.cartPage.getProductQuantity(productName);
    const total = await this.cartPage.getProductTotal(productName);
    assert.equal(total, price * quantity, `Total ${total} ≠ ${price} × ${quantity}`);
  },
);
