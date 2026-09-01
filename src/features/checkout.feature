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
