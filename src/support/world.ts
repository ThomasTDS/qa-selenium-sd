import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { WebDriver } from 'selenium-webdriver';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';

export class CustomWorld extends World {
  driver!: WebDriver;
  homePage!: HomePage;
  loginPage!: LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPages(): void {
    this.homePage = new HomePage(this.driver);
    this.loginPage = new LoginPage(this.driver);
  }
}

setWorldConstructor(CustomWorld);
