import { By, WebDriver, until } from 'selenium-webdriver';
import { ContactMessage } from '../support/test-data';
import { BasePage } from './base.page';

const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const NAME_INPUT = By.css('input[data-qa="name"]');
const EMAIL_INPUT = By.css('input[data-qa="email"]');
const SUBJECT_INPUT = By.css('input[data-qa="subject"]');
const MESSAGE_TEXTAREA = By.css('textarea[data-qa="message"]');
const FILE_INPUT = By.css('input[name="upload_file"]');
const SUBMIT_BUTTON = By.css('input[data-qa="submit-button"]');
const SUCCESS_MESSAGE = By.css('.contact-form .status.alert-success');

export class ContactPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async goto(): Promise<void> {
    await this.open(`${BASE_URL}/contact_us`);
  }

  async fill(message: ContactMessage): Promise<void> {
    await this.type(NAME_INPUT, message.name);
    await this.type(EMAIL_INPUT, message.email);
    await this.type(SUBJECT_INPUT, message.subject);
    await this.type(MESSAGE_TEXTAREA, message.message);
  }

  // Input de arquivo recebe o caminho absoluto via sendKeys. Não dá para usar
  // type(), porque clear() não funciona nesse tipo de input.
  async attachFile(absolutePath: string): Promise<void> {
    const input = await this.find(FILE_INPUT);
    await input.sendKeys(absolutePath);
  }

  async submit(): Promise<void> {
    await this.click(SUBMIT_BUTTON);
  }

  // O envio abre um confirm() nativo do browser; só aceitando ele o site
  // mostra a mensagem de sucesso.
  async answerConfirmation(accept: boolean): Promise<void> {
    const alert = await this.driver.wait(until.alertIsPresent(), 5000);
    if (accept) {
      await alert.accept();
    } else {
      await alert.dismiss();
    }
  }

  async isConfirmationShown(timeout = 2000): Promise<boolean> {
    try {
      await this.driver.wait(until.alertIsPresent(), timeout);
      return true;
    } catch {
      return false;
    }
  }

  async getSuccessMessage(): Promise<string> {
    const element = await this.find(SUCCESS_MESSAGE);
    await this.driver.wait(until.elementIsVisible(element), 5000);
    return element.getText();
  }

  // O elemento existe (oculto) desde o carregamento da página, então
  // isVisible() responde na hora em vez de esperar o timeout inteiro.
  async isSuccessMessageShown(): Promise<boolean> {
    return this.isVisible(SUCCESS_MESSAGE);
  }

  async isEmailMarkedAsMissing(): Promise<boolean> {
    const input = await this.find(EMAIL_INPUT);
    return this.driver.executeScript<boolean>('return arguments[0].validity.valueMissing;', input);
  }
}
