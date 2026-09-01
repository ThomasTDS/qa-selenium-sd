Feature: Login
  Como um usuário do Automation Exercise
  Eu quero acessar a página de login
  Para entrar na minha conta ou ver mensagens de erro em tentativas inválidas

  Background:
    Given que estou na página inicial do Automation Exercise

  @TC-001
  Scenario: Exibir formulários de login e cadastro
    When eu acesso a página de login
    Then devo ver o formulário de login
    And devo ver o formulário de cadastro

  @TC-002
  Scenario: Tentar login com credenciais inválidas
    When eu acesso a página de login
    And eu tento logar com o email "invalido_teste_qa@example.com" e a senha "SenhaErrada123"
    Then devo ver a mensagem de erro "Your email or password is incorrect!"
