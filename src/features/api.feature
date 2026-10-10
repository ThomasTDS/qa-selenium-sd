@api
Feature: API pública do Automation Exercise
  Como um integrador da loja
  Eu quero consumir a API pública de produtos e contas
  Para obter os mesmos dados e regras que o site oferece

  # A API sempre responde HTTP 200; o "código de resposta" é o campo
  # responseCode do corpo, onde a API coloca o status real.

  @TC-024
  Scenario: Listar todos os produtos
    When eu envio um GET para "/productsList"
    Then o código de resposta deve ser 200
    And a lista "products" deve conter um item com "name" igual a "Blue Top"

  @TC-025
  Scenario: Listar todas as marcas
    When eu envio um GET para "/brandsList"
    Then o código de resposta deve ser 200
    And a lista "brands" deve conter um item com "brand" igual a "Polo"

  @TC-026
  Scenario Outline: Recusar o método <método> em "<endpoint>"
    When eu envio um <método> para "<endpoint>"
    Then o código de resposta deve ser 405
    And a mensagem da resposta deve ser "This request method is not supported."

    Examples:
      | método | endpoint      |
      | POST   | /productsList |
      | PUT    | /brandsList   |
      | DELETE | /verifyLogin  |

  @TC-027
  Scenario: Buscar produtos por um termo
    When eu envio um POST para "/searchProduct" com os parâmetros:
      | search_product | top |
    Then o código de resposta deve ser 200
    And a lista "products" deve conter um item com "name" igual a "Blue Top"

  @TC-028
  Scenario: Buscar produtos sem informar o termo
    When eu envio um POST para "/searchProduct"
    Then o código de resposta deve ser 400
    And a mensagem da resposta deve ser "Bad request, search_product parameter is missing in POST request."

  @TC-029
  Scenario: Verificar o login com credenciais válidas
    Given que tenho uma conta cadastrada
    When eu verifico o login da conta que criei pela API
    Then o código de resposta deve ser 200
    And a mensagem da resposta deve ser "User exists!"

  @TC-030
  Scenario: Verificar o login com a senha errada
    Given que tenho uma conta cadastrada
    When eu verifico o login da conta que criei com a senha "SenhaErrada123"
    Then o código de resposta deve ser 404
    And a mensagem da resposta deve ser "User not found!"

  @TC-031
  Scenario: Verificar o login sem informar o e-mail
    When eu envio um POST para "/verifyLogin" com os parâmetros:
      | password | Teste@123 |
    Then o código de resposta deve ser 400
    And a mensagem da resposta deve ser "Bad request, email or password parameter is missing in POST request."

  @TC-032
  Scenario: Consultar os dados de uma conta pelo e-mail
    Given que tenho uma conta cadastrada
    When eu consulto os dados da conta que criei pela API
    Then o código de resposta deve ser 200
    And o campo "email" do usuário deve ser o e-mail da conta que criei
    And o campo "city" do usuário deve ser "Toronto"

  @TC-033
  Scenario: Atualizar os dados de uma conta
    Given que tenho uma conta cadastrada
    When eu atualizo a cidade da conta que criei para "Vancouver"
    Then o código de resposta deve ser 200
    And a mensagem da resposta deve ser "User updated!"

    When eu consulto os dados da conta que criei pela API
    Then o campo "city" do usuário deve ser "Vancouver"

  @TC-034
  Scenario: Tentar criar uma conta com um e-mail já cadastrado
    Given que tenho uma conta cadastrada
    When eu tento criar outra conta com o mesmo e-mail
    Then o código de resposta deve ser 400
    And a mensagem da resposta deve ser "Email already exists!"
