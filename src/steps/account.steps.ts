import { Given, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { createAccount } from '../support/api-client';
import { CustomWorld } from '../support/world';
import { TestAccount, generateTestAccount } from '../support/test-data';

const REQUIRED_FIELD_BY_LABEL: Record<string, keyof TestAccount> = {
  endereço: 'address',
  nome: 'firstName',
  sobrenome: 'lastName',
  estado: 'state',
  cidade: 'city',
  cep: 'zipcode',
  telefone: 'mobileNumber',
};

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

// A conta é só pré-condição nesses passos, então é criada pela API (mais rápido
// e com menos pontos de falha). O cadastro pela interface é coberto pelo TC-009.
async function createTestAccountViaApi(world: CustomWorld): Promise<TestAccount> {
  // Atribuído antes da chamada para o hook de limpeza excluir a conta mesmo
  // que algo falhe depois da criação.
  world.testAccount = generateTestAccount();
  const { responseCode, message } = await createAccount(world.testAccount);
  assert.equal(responseCode, 201, `Falha ao criar a conta de teste via API: ${message}`);
  return world.testAccount;
}

Given('que tenho uma conta cadastrada', async function (this: CustomWorld) {
  await createTestAccountViaApi(this);
});

Given('que crio e faço login com uma nova conta', async function (this: CustomWorld) {
  const account = await createTestAccountViaApi(this);
  await this.homePage.goto();
  await this.homePage.goToLoginPage();
  await this.loginPage.login(account.email, account.password);
  assert.equal(await this.homePage.isLoggedIn(), true, 'Login com a conta criada via API falhou');
});

When('eu saio da minha conta', async function (this: CustomWorld) {
  await this.homePage.logout();
});

When('eu me cadastro novamente com o mesmo nome e email', async function (this: CustomWorld) {
  await this.loginPage.signup(this.testAccount!.name, this.testAccount!.email);
});

Then(
  'devo ver a mensagem de cadastro {string}',
  async function (this: CustomWorld, expectedMessage: string) {
    const message = await this.loginPage.getSignupErrorMessage();
    assert.equal(message, expectedMessage);
  },
);

When('eu faço login com a conta que criei', async function (this: CustomWorld) {
  await this.loginPage.login(this.testAccount!.email, this.testAccount!.password);
});

When(
  'eu tento confirmar o cadastro sem preencher o campo {string}',
  async function (this: CustomWorld, fieldLabel: string) {
    const field = REQUIRED_FIELD_BY_LABEL[fieldLabel];
    const incompleteAccount = { ...this.testAccount!, [field]: '' };
    await this.signupPage.fillAccountInformation(incompleteAccount);
    await this.signupPage.submit();
  },
);

Then('minha conta não deve ser criada', async function (this: CustomWorld) {
  const isCreated = await this.signupPage.isAccountCreated();
  assert.equal(isCreated, false);
});
