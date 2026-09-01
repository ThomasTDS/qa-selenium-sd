import { By, WebDriver } from 'selenium-webdriver';
import { TestAccount } from '../support/test-data';
import { BasePage } from './base.page';

const TITLE_MR_RADIO = By.css('#id_gender1');
const PASSWORD_INPUT = By.css('input[data-qa="password"]');
const DAYS_SELECT = By.css('select[data-qa="days"]');
const MONTHS_SELECT = By.css('select[data-qa="months"]');
const YEARS_SELECT = By.css('select[data-qa="years"]');
const FIRST_NAME_INPUT = By.css('input[data-qa="first_name"]');
const LAST_NAME_INPUT = By.css('input[data-qa="last_name"]');
const ADDRESS_INPUT = By.css('input[data-qa="address"]');
const COUNTRY_SELECT = By.css('select[data-qa="country"]');
const STATE_INPUT = By.css('input[data-qa="state"]');
const CITY_INPUT = By.css('input[data-qa="city"]');
const ZIPCODE_INPUT = By.css('input[data-qa="zipcode"]');
const MOBILE_NUMBER_INPUT = By.css('input[data-qa="mobile_number"]');
const CREATE_ACCOUNT_BUTTON = By.css('button[data-qa="create-account"]');
const ACCOUNT_CREATED_TITLE = By.css('[data-qa="account-created"]');
const CONTINUE_BUTTON = By.css('[data-qa="continue-button"]');

export class SignupPage extends BasePage {
  constructor(driver: WebDriver) {
    super(driver);
  }

  async fillAccountInformation(account: TestAccount): Promise<void> {
    await this.click(TITLE_MR_RADIO);
    await this.type(PASSWORD_INPUT, account.password);
    await this.select(DAYS_SELECT, '10');
    await this.select(MONTHS_SELECT, 'May');
    await this.select(YEARS_SELECT, '1995');
    await this.type(FIRST_NAME_INPUT, account.firstName);
    await this.type(LAST_NAME_INPUT, account.lastName);
    await this.type(ADDRESS_INPUT, account.address);
    await this.select(COUNTRY_SELECT, account.country);
    await this.type(STATE_INPUT, account.state);
    await this.type(CITY_INPUT, account.city);
    await this.type(ZIPCODE_INPUT, account.zipcode);
    await this.type(MOBILE_NUMBER_INPUT, account.mobileNumber);
  }

  async submit(): Promise<void> {
    await this.click(CREATE_ACCOUNT_BUTTON);
  }

  async isAccountCreated(): Promise<boolean> {
    return this.isVisible(ACCOUNT_CREATED_TITLE);
  }

  async continueToHome(): Promise<void> {
    await this.click(CONTINUE_BUTTON);
  }
}
