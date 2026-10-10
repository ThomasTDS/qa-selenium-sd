Feature: Produtos
  Como um usuário do Automation Exercise
  Eu quero buscar produtos e ver os detalhes de cada um
  Para encontrar o que procuro antes de adicionar ao carrinho

  Background:
    Given que estou na página de produtos

  @TC-014
  Scenario: Buscar um produto pelo nome
    When eu busco por "Blue Top"
    Then o produto "Blue Top" deve aparecer nos resultados da busca

  @TC-015
  Scenario: Buscar um produto inexistente
    When eu busco por "produto-que-nao-existe"
    Then a busca não deve retornar nenhum produto

  @TC-016
  Scenario: Ver os detalhes de um produto
    When eu abro os detalhes do produto "Blue Top"
    Then devo ver os detalhes do produto:
      | nome            | Blue Top     |
      | categoria       | Women > Tops |
      | preço           | Rs. 500      |
      | disponibilidade | In Stock     |
      | condição        | New          |
      | marca           | Polo         |
