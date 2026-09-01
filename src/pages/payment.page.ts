import { By, WebDriver } from 'selenium-webdriver';
import { TestCard } from '../support/test-data';
import { BasePage } from './base.page';

const NAME_ON_CARD_INPUT = By.css('input[data-qa="name-on-card"]');
const CARD_NUMBER_INPUT = By.css('input[data-qa="card-number"]');
const CVC_INPUT = By.css('input[data-qa="cvc"]');
const EXPIRY_MONTH_INPUT = By.css('input[data-qa="expiry-month"]');
const EXPIRY_YEAR_INPUT = By.css('input[data-qa="expiry-year"]');
const PAY_BUTTON = By.css('button[data-qa="pay-button"]');
const ORDER_CONFIRMATION_TITLE = By.css('[data-qa="order-placed"]');

export class PaymentPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async fillCardDetails(card: TestCard): Promise<void> {
    await this.type(NAME_ON_CARD_INPUT, card.nameOnCard);
    await this.type(CARD_NUMBER_INPUT, card.cardNumber);
    await this.type(CVC_INPUT, card.cvc);
    await this.type(EXPIRY_MONTH_INPUT, card.expiryMonth);
    await this.type(EXPIRY_YEAR_INPUT, card.expiryYear);
  }

  async pay(): Promise<void> {
    await this.click(PAY_BUTTON);
  }

  async getOrderConfirmationTitle(): Promise<string> {
    return this.getText(ORDER_CONFIRMATION_TITLE);
  }

  async isOrderConfirmed(): Promise<boolean> {
    return this.isVisible(ORDER_CONFIRMATION_TITLE, 3000);
  }
}
