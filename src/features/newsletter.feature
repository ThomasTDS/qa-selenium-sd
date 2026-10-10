Feature: Newsletter
  Como um visitante do Automation Exercise
  Eu quero assinar a newsletter pelo rodapé do site
  Para receber novidades e promoções por e-mail

  @TC-022
  Scenario Outline: Assinar a newsletter a partir da página <página>
    Given que estou na página "<página>"
    When eu assino a newsletter com um e-mail válido
    Then devo ver a mensagem da newsletter "You have been successfully subscribed!"

    Examples:
      | página   |
      | inicial  |
      | carrinho |

  @TC-023
  Scenario: Tentar assinar a newsletter com um e-mail inválido
    Given que estou na página "inicial"
    When eu tento assinar a newsletter com o e-mail "email-invalido"
    Then a assinatura deve ser barrada por e-mail inválido
