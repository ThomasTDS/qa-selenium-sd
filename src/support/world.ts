import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { WebDriver } from 'selenium-webdriver';
import { CartPage } from '../pages/cart.page';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';

export class CustomWorld extends World {
  driver!: WebDriver;
  homePage!: HomePage;
  loginPage!: LoginPage;
  productsPage!: ProductsPage;
  cartPage!: CartPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPages(): void {
    this.homePage = new HomePage(this.driver);
    this.loginPage = new LoginPage(this.driver);
    this.productsPage = new ProductsPage(this.driver);
    this.cartPage = new CartPage(this.driver);
  }
}

setWorldConstructor(CustomWorld);
