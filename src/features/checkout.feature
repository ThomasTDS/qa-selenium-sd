Feature: Checkout
  Como um usuário do Automation Exercise
  Eu quero ser barrado ao tentar finalizar a compra sem estar logado
  Para garantir que apenas usuários autenticados concluam um pedido

  Scenario: Tentar finalizar a compra sem estar logado
    Given que estou na página de produtos
    And que adicionei o produto "Blue Top" ao carrinho
    When eu vou para o carrinho
    And eu tento prosseguir para o checkout
    Then devo ver a mensagem "Register / Login account to proceed on checkout."

  Scenario: Finalizar a compra com sucesso estando logado
    Given que crio e faço login com uma nova conta
    And que estou na página de produtos
    And que adicionei o produto "Blue Top" ao carrinho
    When eu vou para o carrinho
    And eu tento prosseguir para o checkout
    And eu confirmo o pedido no checkout
    And eu pago o pedido com um cartão de teste
    Then devo ver a confirmação "ORDER PLACED!"

    When eu excluo minha conta
    Then minha conta deve ser excluída com sucesso
