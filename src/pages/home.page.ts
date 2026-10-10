import { By, WebDriver } from 'selenium-webdriver';
import { BasePage } from './base.page';

const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const SIGNUP_LOGIN_LINK = By.css('a[href="/login"]');
const LOGOUT_LINK = By.css('a[href="/logout"]');
const LOGGED_IN_USERNAME = By.xpath('//a[contains(., "Logged in as")]/b');

export class HomePage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async goto(): Promise<void> {
    await this.open(BASE_URL);
  }

  async goToLoginPage(): Promise<void> {
    await this.click(SIGNUP_LOGIN_LINK);
  }

  async isLoggedIn(): Promise<boolean> {
    return this.isVisible(LOGOUT_LINK);
  }

  // Checa o link "Signup / Login" em vez de esperar o de logout sumir, para não
  // pagar o timeout inteiro de isLoggedIn() no caso esperado.
  async isLoggedOut(): Promise<boolean> {
    return this.isVisible(SIGNUP_LOGIN_LINK);
  }

  async getLoggedInUsername(): Promise<string> {
    return this.getText(LOGGED_IN_USERNAME);
  }

  async logout(): Promise<void> {
    await this.click(LOGOUT_LINK);
  }
}
