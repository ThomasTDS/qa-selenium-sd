import { By, WebDriver } from 'selenium-webdriver';
import { BasePage } from './base.page';

const PRODUCT_NAME = By.css('.product-information h2');
const PRODUCT_CATEGORY = By.xpath(
  '//div[@class="product-information"]/p[starts-with(., "Category:")]',
);
const PRODUCT_PRICE = By.css('.product-information span > span');

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
}
