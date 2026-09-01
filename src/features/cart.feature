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
