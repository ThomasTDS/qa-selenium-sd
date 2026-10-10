import { By, WebDriver, until } from 'selenium-webdriver';
import { BasePage } from './base.page';

const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const EMPTY_CART_MESSAGE = By.css('#empty_cart');
const PROCEED_TO_CHECKOUT_BUTTON = By.xpath('//a[contains(text(),"Proceed To Checkout")]');
const CHECKOUT_GUARD_MESSAGE = By.css('#checkoutModal .modal-body p');

function cartRow(productName: string): By {
  return By.xpath(`//tr[td[@class="cart_description"]//a[text()="${productName}"]]`);
}

function cartRowCell(productName: string, cellClass: string): By {
  return By.xpath(
    `//tr[td[@class="cart_description"]//a[text()="${productName}"]]/td[@class="${cellClass}"]`,
  );
}

// O carrinho mostra valores como "Rs. 500".
function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9]/g, ''));
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

  async getProductPrice(productName: string): Promise<number> {
    return parsePrice(await this.getText(cartRowCell(productName, 'cart_price')));
  }

  async getProductQuantity(productName: string): Promise<number> {
    return Number(await this.getText(cartRowCell(productName, 'cart_quantity')));
  }

  async getProductTotal(productName: string): Promise<number> {
    return parsePrice(await this.getText(cartRowCell(productName, 'cart_total')));
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(PROCEED_TO_CHECKOUT_BUTTON);
  }

  async getCheckoutGuardMessage(): Promise<string> {
    return this.getText(CHECKOUT_GUARD_MESSAGE);
  }
}
