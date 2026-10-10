import { By, WebDriver, until } from 'selenium-webdriver';
import { BasePage } from './base.page';

const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const CART_MODAL = By.css('#cartModal');
const CONTINUE_SHOPPING_BUTTON = By.css('#cartModal .close-modal');
const SEARCH_INPUT = By.css('#search_product');
const SEARCH_BUTTON = By.css('#submit_search');
// Compara o texto do HTML (e não o renderizado), então não depende de CSS em maiúsculas.
const SEARCHED_PRODUCTS_TITLE = By.xpath(
  '//h2[contains(@class,"title") and normalize-space()="Searched Products"]',
);
const PRODUCT_NAMES = By.css('.features_items .productinfo p');

function addToCartButton(productName: string): By {
  return By.xpath(
    `//div[@class="productinfo text-center"][p[text()="${productName}"]]//a[contains(@class,"add-to-cart")]`,
  );
}

function viewProductLink(productName: string): By {
  return By.xpath(
    `//div[@class="product-image-wrapper"][.//div[@class="productinfo text-center"]/p[text()="${productName}"]]//a[contains(@href,"/product_details/")]`,
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

  async search(term: string): Promise<void> {
    await this.type(SEARCH_INPUT, term);
    await this.click(SEARCH_BUTTON);
    await this.find(SEARCHED_PRODUCTS_TITLE);
  }

  async getProductNames(): Promise<string[]> {
    const products = await this.driver.findElements(PRODUCT_NAMES);
    return Promise.all(products.map((product) => product.getText()));
  }

  async openProductDetails(productName: string): Promise<void> {
    await this.click(viewProductLink(productName));
  }
}
