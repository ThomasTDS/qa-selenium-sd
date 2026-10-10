import { DataTable, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { ProductDetails } from '../pages/product-details.page';
import { CustomWorld } from '../support/world';

const DETAIL_BY_LABEL: Record<string, keyof ProductDetails> = {
  nome: 'name',
  categoria: 'category',
  preço: 'price',
  disponibilidade: 'availability',
  condição: 'condition',
  marca: 'brand',
};

When('eu busco por {string}', async function (this: CustomWorld, term: string) {
  await this.productsPage.search(term);
});

Then(
  'o produto {string} deve aparecer nos resultados da busca',
  async function (this: CustomWorld, productName: string) {
    const names = await this.productsPage.getProductNames();
    assert.ok(names.includes(productName), `"${productName}" não está em: ${names.join(', ')}`);
  },
);

Then('a busca não deve retornar nenhum produto', async function (this: CustomWorld) {
  const names = await this.productsPage.getProductNames();
  assert.deepEqual(names, []);
});

When(
  'eu abro os detalhes do produto {string}',
  async function (this: CustomWorld, productName: string) {
    await this.productsPage.openProductDetails(productName);
  },
);

Then('devo ver os detalhes do produto:', async function (this: CustomWorld, table: DataTable) {
  const details = await this.productDetailsPage.getDetails();
  const expected = table.rowsHash();
  for (const [label, value] of Object.entries(expected)) {
    assert.equal(
      details[DETAIL_BY_LABEL[label]],
      value,
      `Detalhe "${label}" diferente do esperado`,
    );
  }
});
