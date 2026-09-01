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

  Scenario: Tentar cadastrar com um e-mail já existente
    Given que crio e faço login com uma nova conta
    When eu saio da minha conta
    And eu me cadastro novamente com o mesmo nome e email
    Then devo ver a mensagem de cadastro "Email Address already exist!"

    When eu faço login com a conta que criei
    And eu excluo minha conta
    Then minha conta deve ser excluída com sucesso

  Scenario: Tentar cadastrar sem preencher um campo obrigatório
    Given que estou na página inicial do Automation Exercise
    When eu acesso a página de login
    And eu me cadastro com um novo nome e email
    And eu tento confirmar o cadastro sem preencher o endereço
    Then minha conta não deve ser criada
