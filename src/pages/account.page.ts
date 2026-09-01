import { By, WebDriver } from 'selenium-webdriver';
import { BasePage } from './base.page';

const DELETE_ACCOUNT_LINK = By.css('a[href="/delete_account"]');
const ACCOUNT_DELETED_TITLE = By.css('[data-qa="account-deleted"]');

export class AccountPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async deleteAccount(): Promise<void> {
    await this.click(DELETE_ACCOUNT_LINK);
  }

  async isAccountDeleted(): Promise<boolean> {
    return this.isVisible(ACCOUNT_DELETED_TITLE);
  }
}
