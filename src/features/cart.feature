Feature: Carrinho de compras
  Como um usuário do Automation Exercise
  Eu quero adicionar e remover produtos do carrinho
  Para montar minha compra antes de finalizar o pedido

  Background:
    Given que estou na página de produtos

  @TC-003
  Scenario: Adicionar um produto ao carrinho
    When eu adiciono o produto "Blue Top" ao carrinho
    And eu vou para o carrinho
    Then o produto "Blue Top" deve estar no carrinho

  @TC-004
  Scenario: Remover um produto do carrinho
    Given que adicionei o produto "Blue Top" ao carrinho
    And eu vou para o carrinho
    When eu removo o produto "Blue Top" do carrinho
    Then o carrinho deve estar vazio

  @TC-005
  Scenario: Visualizar o carrinho vazio sem adicionar nenhum produto
    When eu vou para o carrinho
    Then o carrinho deve estar vazio

  @TC-017
  Scenario: Adicionar um produto com quantidade maior que 1
    When eu abro os detalhes do produto "Blue Top"
    And eu adiciono 4 unidades do produto ao carrinho
    And eu vou para o carrinho
    Then o produto "Blue Top" deve estar no carrinho com quantidade 4
    And o total do produto "Blue Top" deve ser o preço unitário vezes a quantidade

  @TC-018
  Scenario: Adicionar o mesmo produto duas vezes soma as quantidades
    When eu adiciono o produto "Blue Top" ao carrinho
    And eu continuo comprando
    And eu adiciono o produto "Blue Top" ao carrinho
    And eu vou para o carrinho
    Then o produto "Blue Top" deve estar no carrinho com quantidade 2
    And o total do produto "Blue Top" deve ser o preço unitário vezes a quantidade
