import { By, WebDriver } from 'selenium-webdriver';
import { BasePage } from './base.page';

const PLACE_ORDER_BUTTON = By.xpath('//a[contains(text(),"Place Order")]');

export class CheckoutPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async placeOrder(): Promise<void> {
    await this.click(PLACE_ORDER_BUTTON);
  }
}
