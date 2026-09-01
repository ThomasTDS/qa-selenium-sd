import { By, WebDriver } from 'selenium-webdriver';
import { BasePage } from './base.page';

const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const SIGNUP_LOGIN_LINK = By.css('a[href="/login"]');

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
}
