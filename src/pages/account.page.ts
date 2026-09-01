import { By, WebDriver } from 'selenium-webdriver';
import { BasePage } from './base.page';

const BASE_URL = process.env.BASE_URL ?? 'https://automationexercise.com';

const ACCOUNT_DELETED_TITLE = By.css('[data-qa="account-deleted"]');

export class AccountPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async deleteAccount(): Promise<void> {
    await this.open(`${BASE_URL}/delete_account`);
  }

  async isAccountDeleted(): Promise<boolean> {
    return this.isVisible(ACCOUNT_DELETED_TITLE);
  }
}
