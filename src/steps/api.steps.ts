import { DataTable, Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import { ApiResponse, apiRequest, createAccount, updateAccount } from '../support/api-client';
import { TestAccount } from '../support/test-data';
import { CustomWorld } from '../support/world';

function createdAccount(world: CustomWorld): TestAccount {
  assert.ok(world.testAccount, 'Nenhuma conta foi criada neste cenário');
  return world.testAccount;
}

function lastResponse(world: CustomWorld): ApiResponse {
  assert.ok(world.apiResponse, 'Nenhuma requisição foi enviada neste cenário');
  return world.apiResponse;
}

function listField(world: CustomWorld, field: string): Record<string, unknown>[] {
  const list = lastResponse(world)[field];
  assert.ok(Array.isArray(list), `A resposta não tem a lista "${field}"`);
  return list as Record<string, unknown>[];
}

When(
  'eu envio um {word} para {string}',
  async function (this: CustomWorld, method: string, path: string) {
    this.apiResponse = await apiRequest(method, path);
  },
);

When(
  'eu envio um {word} para {string} com os parâmetros:',
  async function (this: CustomWorld, method: string, path: string, table: DataTable) {
    this.apiResponse = await apiRequest(method, path, table.rowsHash());
  },
);

When('eu verifico o login da conta que criei pela API', async function (this: CustomWorld) {
  const { email, password } = createdAccount(this);
  this.apiResponse = await apiRequest('POST', '/verifyLogin', { email, password });
});

When(
  'eu verifico o login da conta que criei com a senha {string}',
  async function (this: CustomWorld, password: string) {
    const { email } = createdAccount(this);
    this.apiResponse = await apiRequest('POST', '/verifyLogin', { email, password });
  },
);

When('eu consulto os dados da conta que criei pela API', async function (this: CustomWorld) {
  const { email } = createdAccount(this);
  this.apiResponse = await apiRequest('GET', '/getUserDetailByEmail', { email });
});

When(
  'eu atualizo a cidade da conta que criei para {string}',
  async function (this: CustomWorld, city: string) {
    const account = createdAccount(this);
    this.apiResponse = await updateAccount({ ...account, city });
  },
);

When('eu tento criar outra conta com o mesmo e-mail', async function (this: CustomWorld) {
  this.apiResponse = await createAccount(createdAccount(this));
});

// A API sempre responde HTTP 200; o código que importa é o `responseCode` do corpo.
Then(
  'o código de resposta deve ser {int}',
  async function (this: CustomWorld, expectedCode: number) {
    const { responseCode, message } = lastResponse(this);
    assert.equal(responseCode, expectedCode, `Mensagem da API: ${message ?? '(nenhuma)'}`);
  },
);

Then(
  'a mensagem da resposta deve ser {string}',
  async function (this: CustomWorld, expectedMessage: string) {
    assert.equal(lastResponse(this).message, expectedMessage);
  },
);

Then(
  'a lista {string} deve conter um item com {string} igual a {string}',
  async function (this: CustomWorld, field: string, key: string, expectedValue: string) {
    const values = listField(this, field).map((item) => item[key]);
    assert.ok(
      values.includes(expectedValue),
      `Nenhum item de "${field}" tem ${key} = "${expectedValue}"`,
    );
  },
);

Then('a lista {string} deve estar vazia', async function (this: CustomWorld, field: string) {
  assert.deepEqual(listField(this, field), []);
});

Then(
  'o campo {string} do usuário deve ser {string}',
  async function (this: CustomWorld, key: string, expectedValue: string) {
    const user = lastResponse(this).user as Record<string, unknown> | undefined;
    assert.ok(user, 'A resposta não tem o campo "user"');
    assert.equal(user[key], expectedValue);
  },
);

Then(
  'o campo {string} do usuário deve ser o e-mail da conta que criei',
  async function (this: CustomWorld, key: string) {
    const user = lastResponse(this).user as Record<string, unknown> | undefined;
    assert.ok(user, 'A resposta não tem o campo "user"');
    assert.equal(user[key], createdAccount(this).email);
  },
);
