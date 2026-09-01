import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { WebDriver } from 'selenium-webdriver';
import { AccountPage } from '../pages/account.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { PaymentPage } from '../pages/payment.page';
import { ProductsPage } from '../pages/products.page';
import { SignupPage } from '../pages/signup.page';
import { TestAccount } from './test-data';

export class CustomWorld extends World {
  driver!: WebDriver;
  homePage!: HomePage;
  loginPage!: LoginPage;
  productsPage!: ProductsPage;
  cartPage!: CartPage;
  signupPage!: SignupPage;
  checkoutPage!: CheckoutPage;
  paymentPage!: PaymentPage;
  accountPage!: AccountPage;
  testAccount?: TestAccount;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPages(): void {
    this.homePage = new HomePage(this.driver);
    this.loginPage = new LoginPage(this.driver);
    this.productsPage = new ProductsPage(this.driver);
    this.cartPage = new CartPage(this.driver);
    this.signupPage = new SignupPage(this.driver);
    this.checkoutPage = new CheckoutPage(this.driver);
    this.paymentPage = new PaymentPage(this.driver);
    this.accountPage = new AccountPage(this.driver);
  }
}

setWorldConstructor(CustomWorld);
