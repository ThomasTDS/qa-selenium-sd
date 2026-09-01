import { By, WebDriver, until } from 'selenium-webdriver';
import { BasePage } from './base.page';

const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const EMPTY_CART_MESSAGE = By.css('#empty_cart');
const PROCEED_TO_CHECKOUT_BUTTON = By.xpath('//a[contains(text(),"Proceed To Checkout")]');
const CHECKOUT_GUARD_MESSAGE = By.css('#checkoutModal .modal-body p');

function cartRow(productName: string): By {
  return By.xpath(`//tr[td[@class="cart_description"]//a[text()="${productName}"]]`);
}

function cartRowDeleteButton(productName: string): By {
  return By.xpath(
    `//tr[td[@class="cart_description"]//a[text()="${productName}"]]//a[contains(@class,"cart_quantity_delete")]`,
  );
}

export class CartPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async goto(): Promise<void> {
    await this.open(`${BASE_URL}/view_cart`);
  }

  async hasProduct(productName: string): Promise<boolean> {
    return this.isVisible(cartRow(productName), 5000);
  }

  async isEmpty(): Promise<boolean> {
    return this.isVisible(EMPTY_CART_MESSAGE, 5000);
  }

  async removeProduct(productName: string): Promise<void> {
    const row = await this.find(cartRow(productName));
    await this.click(cartRowDeleteButton(productName));
    await this.driver.wait(until.stalenessOf(row), 5000);
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(PROCEED_TO_CHECKOUT_BUTTON);
  }

  async getCheckoutGuardMessage(): Promise<string> {
    return this.getText(CHECKOUT_GUARD_MESSAGE);
  }
}
