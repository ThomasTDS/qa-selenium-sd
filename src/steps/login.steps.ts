import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { CustomWorld } from '../support/world';

Given('que estou na página inicial do Automation Exercise', async function (this: CustomWorld) {
  await this.homePage.goto();
});

When('eu acesso a página de login', async function (this: CustomWorld) {
  await this.homePage.goToLoginPage();
});

When(
  'eu tento logar com o email {string} e a senha {string}',
  async function (this: CustomWorld, email: string, password: string) {
    await this.loginPage.login(email, password);
  },
);

Then('devo ver o formulário de login', async function (this: CustomWorld) {
  const isDisplayed = await this.loginPage.isLoginFormDisplayed();
  assert.equal(isDisplayed, true);
});

Then('devo ver o formulário de cadastro', async function (this: CustomWorld) {
  const isDisplayed = await this.loginPage.isSignupFormDisplayed();
  assert.equal(isDisplayed, true);
});

Then(
  'devo ver a mensagem de erro {string}',
  async function (this: CustomWorld, expectedMessage: string) {
    const message = await this.loginPage.getErrorMessage();
    assert.equal(message, expectedMessage);
  },
);
