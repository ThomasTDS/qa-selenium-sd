import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import path from 'node:path';
import { generateContactMessage } from '../support/test-data';
import { CustomWorld } from '../support/world';

const ATTACHMENT_PATH = path.resolve(__dirname, '../fixtures/anexo-contato.txt');

Given('que estou na página de contato', async function (this: CustomWorld) {
  await this.contactPage.goto();
});

When('eu preencho o formulário de contato', async function (this: CustomWorld) {
  await this.contactPage.fill(generateContactMessage());
});

When('eu preencho o formulário de contato com um anexo', async function (this: CustomWorld) {
  await this.contactPage.fill(generateContactMessage());
  await this.contactPage.attachFile(ATTACHMENT_PATH);
});

When('eu preencho o formulário de contato sem o e-mail', async function (this: CustomWorld) {
  await this.contactPage.fill({ ...generateContactMessage(), email: '' });
});

When('eu envio o formulário de contato', async function (this: CustomWorld) {
  await this.contactPage.submit();
});

When('eu confirmo o envio', async function (this: CustomWorld) {
  await this.contactPage.answerConfirmation(true);
});

When('eu cancelo o envio', async function (this: CustomWorld) {
  await this.contactPage.answerConfirmation(false);
});

Then(
  'devo ver a mensagem de contato {string}',
  async function (this: CustomWorld, expectedMessage: string) {
    const message = await this.contactPage.getSuccessMessage();
    assert.equal(message, expectedMessage);
  },
);

Then('a mensagem de sucesso do contato não deve aparecer', async function (this: CustomWorld) {
  const isShown = await this.contactPage.isSuccessMessageShown();
  assert.equal(isShown, false);
});

Then('o envio deve ser barrado porque o e-mail é obrigatório', async function (this: CustomWorld) {
  assert.equal(await this.contactPage.isEmailMarkedAsMissing(), true);
  assert.equal(
    await this.contactPage.isConfirmationShown(),
    false,
    'O diálogo de confirmação abriu mesmo sem e-mail',
  );
});
