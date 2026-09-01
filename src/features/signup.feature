Feature: Cadastro de usuário
  Como um visitante do Automation Exercise
  Eu quero criar uma conta
  Para acessar funcionalidades exclusivas de usuários cadastrados

  Scenario: Criar uma nova conta com sucesso
    Given que estou na página inicial do Automation Exercise
    When eu acesso a página de login
    And eu me cadastro com um novo nome e email
    And eu preencho as informações da conta e confirmo o cadastro
    Then minha conta deve ser criada com sucesso

    When eu continuo para a página inicial
    Then devo ver que estou logado no site

    When eu excluo minha conta
    Then minha conta deve ser excluída com sucesso
