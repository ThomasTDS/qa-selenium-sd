import { By, WebDriver, until } from 'selenium-webdriver';
import { BasePage } from './base.page';

// O id "susbscribe_email" tem esse erro de digitação no próprio site.
const EMAIL_INPUT = By.css('#susbscribe_email');
const SUBSCRIBE_BUTTON = By.css('#subscribe');
const SUCCESS_MESSAGE = By.css('#success-subscribe .alert-success');

/**
 * Formulário de newsletter do rodapé, presente em todas as páginas do site.
 * É um componente e não uma página: funciona sobre a página que estiver aberta.
 */
export class NewsletterComponent extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async subscribe(email: string): Promise<void> {
    await this.type(EMAIL_INPUT, email);
    await this.click(SUBSCRIBE_BUTTON);
  }

  // O site esconde a mensagem 1,5 s depois do envio. A espera consulta a tela
  // várias vezes por segundo, então pega a mensagem dentro dessa janela.
  async getSuccessMessage(): Promise<string> {
    const element = await this.find(SUCCESS_MESSAGE);
    await this.driver.wait(until.elementIsVisible(element), 1500);
    return element.getText();
  }

  // O elemento existe (oculto) desde o carregamento da página, então
  // isVisible() responde na hora em vez de esperar o timeout inteiro.
  async isSuccessMessageShown(): Promise<boolean> {
    return this.isVisible(SUCCESS_MESSAGE);
  }

  async isEmailMarkedAsInvalid(): Promise<boolean> {
    const input = await this.find(EMAIL_INPUT);
    return this.driver.executeScript<boolean>('return arguments[0].validity.typeMismatch;', input);
  }
}
