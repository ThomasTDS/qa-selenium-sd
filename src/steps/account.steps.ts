import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { CustomWorld } from '../support/world';
import { generateTestAccount } from '../support/test-data';

When('eu me cadastro com um novo nome e email', async function (this: CustomWorld) {
  this.testAccount = generateTestAccount();
  await this.loginPage.signup(this.testAccount.name, this.testAccount.email);
});

When(
  'eu preencho as informações da conta e confirmo o cadastro',
  async function (this: CustomWorld) {
    await this.signupPage.fillAccountInformation(this.testAccount!);
    await this.signupPage.submit();
  },
);

Then('minha conta deve ser criada com sucesso', async function (this: CustomWorld) {
  const isCreated = await this.signupPage.isAccountCreated();
  assert.equal(isCreated, true);
});

When('eu continuo para a página inicial', async function (this: CustomWorld) {
  await this.signupPage.continueToHome();
});

Then('devo ver que estou logado no site', async function (this: CustomWorld) {
  const isLoggedIn = await this.homePage.isLoggedIn();
  assert.equal(isLoggedIn, true);
});

When('eu excluo minha conta', async function (this: CustomWorld) {
  await this.accountPage.deleteAccount();
});

Then('minha conta deve ser excluída com sucesso', async function (this: CustomWorld) {
  const isDeleted = await this.accountPage.isAccountDeleted();
  assert.equal(isDeleted, true);
});

Given('que crio e faço login com uma nova conta', async function (this: CustomWorld) {
  this.testAccount = generateTestAccount();
  await this.homePage.goto();
  await this.homePage.goToLoginPage();
  await this.loginPage.signup(this.testAccount.name, this.testAccount.email);
  await this.signupPage.fillAccountInformation(this.testAccount);
  await this.signupPage.submit();
  await this.signupPage.continueToHome();
});
