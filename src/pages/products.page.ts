import { By, WebDriver, until } from 'selenium-webdriver';
import { BasePage } from './base.page';

const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const CART_MODAL = By.css('#cartModal');
const CONTINUE_SHOPPING_BUTTON = By.css('#cartModal .close-modal');

function addToCartButton(productName: string): By {
  return By.xpath(
    `//div[@class="productinfo text-center"][p[text()="${productName}"]]//a[contains(@class,"add-to-cart")]`,
  );
}

export class ProductsPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async goto(): Promise<void> {
    await this.open(`${BASE_URL}/products`);
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.click(addToCartButton(productName));
    const modal = await this.find(CART_MODAL);
    await this.driver.wait(until.elementIsVisible(modal), 5000);
  }

  async continueShopping(): Promise<void> {
    await this.click(CONTINUE_SHOPPING_BUTTON);
  }
}
