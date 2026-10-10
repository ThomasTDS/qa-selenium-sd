import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { randomUUID } from 'node:crypto';
import { CustomWorld } from '../support/world';

const PAGE_BY_NAME: Record<string, (world: CustomWorld) => Promise<void>> = {
  inicial: (world) => world.homePage.goto(),
  carrinho: (world) => world.cartPage.goto(),
};

Given('que estou na página {string}', async function (this: CustomWorld, pageName: string) {
  const goToPage = PAGE_BY_NAME[pageName];
  assert.ok(goToPage, `Página "${pageName}" não mapeada`);
  await goToPage(this);
});

When('eu assino a newsletter com um e-mail válido', async function (this: CustomWorld) {
  await this.newsletter.subscribe(`qa.selenium.${randomUUID()}@example.com`);
});

When(
  'eu tento assinar a newsletter com o e-mail {string}',
  async function (this: CustomWorld, email: string) {
    await this.newsletter.subscribe(email);
  },
);

Then(
  'devo ver a mensagem da newsletter {string}',
  async function (this: CustomWorld, expectedMessage: string) {
    const message = await this.newsletter.getSuccessMessage();
    assert.equal(message, expectedMessage);
  },
);

Then('a assinatura deve ser barrada por e-mail inválido', async function (this: CustomWorld) {
  assert.equal(await this.newsletter.isEmailMarkedAsInvalid(), true);
  assert.equal(await this.newsletter.isSuccessMessageShown(), false);
});
