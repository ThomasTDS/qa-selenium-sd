import { By, WebDriver, until } from 'selenium-webdriver';
import { BasePage } from './base.page';

const PRODUCT_NAME = By.css('.product-information h2');
const PRODUCT_CATEGORY = By.xpath(
  '//div[@class="product-information"]/p[starts-with(., "Category:")]',
);
const PRODUCT_PRICE = By.css('.product-information span > span');
const QUANTITY_INPUT = By.css('#quantity');
const ADD_TO_CART_BUTTON = By.css('.product-information button.cart');
const CART_MODAL = By.css('#cartModal');

// Disponibilidade, condição e marca seguem o formato <p><b>Rótulo:</b> valor</p>.
function productInfo(label: string): By {
  return By.xpath(`//div[@class="product-information"]/p[b[text()="${label}:"]]`);
}

function valueAfterLabel(text: string): string {
  return text.slice(text.indexOf(':') + 1).trim();
}

export interface ProductDetails {
  name: string;
  category: string;
  price: string;
  availability: string;
  condition: string;
  brand: string;
}

export class ProductDetailsPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async getDetails(): Promise<ProductDetails> {
    return {
      name: await this.getText(PRODUCT_NAME),
      category: valueAfterLabel(await this.getText(PRODUCT_CATEGORY)),
      price: await this.getText(PRODUCT_PRICE),
      availability: valueAfterLabel(await this.getText(productInfo('Availability'))),
      condition: valueAfterLabel(await this.getText(productInfo('Condition'))),
      brand: valueAfterLabel(await this.getText(productInfo('Brand'))),
    };
  }

  async addToCart(quantity: number): Promise<void> {
    await this.type(QUANTITY_INPUT, String(quantity));
    await this.click(ADD_TO_CART_BUTTON);
    const modal = await this.find(CART_MODAL);
    await this.driver.wait(until.elementIsVisible(modal), 5000);
  }
}
