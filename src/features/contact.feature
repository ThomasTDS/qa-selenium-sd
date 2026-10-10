Feature: Formulário de contato
  Como um visitante do Automation Exercise
  Eu quero enviar uma mensagem pelo formulário de contato
  Para falar com a loja sem precisar de uma conta

  Background:
    Given que estou na página de contato

  @TC-019
  Scenario: Enviar uma mensagem de contato com anexo
    When eu preencho o formulário de contato com um anexo
    And eu envio o formulário de contato
    And eu confirmo o envio
    Then devo ver a mensagem de contato "Success! Your details have been submitted successfully."

  @TC-020
  Scenario: Cancelar o envio no diálogo de confirmação
    When eu preencho o formulário de contato
    And eu envio o formulário de contato
    And eu cancelo o envio
    Then a mensagem de sucesso do contato não deve aparecer

  @TC-021
  Scenario: Tentar enviar a mensagem sem preencher o e-mail
    When eu preencho o formulário de contato sem o e-mail
    And eu envio o formulário de contato
    Then o envio deve ser barrado porque o e-mail é obrigatório
    And a mensagem de sucesso do contato não deve aparecer
