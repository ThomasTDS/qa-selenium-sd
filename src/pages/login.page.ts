import { By, WebDriver } from 'selenium-webdriver';
import { BasePage } from './base.page';

const LOGIN_FORM = By.css('.login-form');
const SIGNUP_FORM = By.css('.signup-form');
const LOGIN_EMAIL_INPUT = By.css('input[data-qa="login-email"]');
const LOGIN_PASSWORD_INPUT = By.css('input[data-qa="login-password"]');
const LOGIN_BUTTON = By.css('button[data-qa="login-button"]');
const LOGIN_ERROR_MESSAGE = By.css('.login-form p');

export class LoginPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async login(email: string, password: string): Promise<void> {
    await this.type(LOGIN_EMAIL_INPUT, email);
    await this.type(LOGIN_PASSWORD_INPUT, password);
    await this.click(LOGIN_BUTTON);
  }

  async isLoginFormDisplayed(): Promise<boolean> {
    return this.isVisible(LOGIN_FORM);
  }

  async isSignupFormDisplayed(): Promise<boolean> {
    return this.isVisible(SIGNUP_FORM);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(LOGIN_ERROR_MESSAGE);
  }
}
