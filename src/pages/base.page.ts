import { By, WebDriver, WebElement, until } from 'selenium-webdriver';
import { Select } from 'selenium-webdriver/lib/select';

const DEFAULT_TIMEOUT = 10000;

export abstract class BasePage {
  protected constructor(protected readonly driver: WebDriver) {}

  protected async find(locator: By): Promise<WebElement> {
    return this.driver.wait(until.elementLocated(locator), DEFAULT_TIMEOUT);
  }

  protected async click(locator: By): Promise<void> {
    const element = await this.find(locator);
    await this.driver.wait(until.elementIsVisible(element), DEFAULT_TIMEOUT);
    await this.driver.executeScript('arguments[0].scrollIntoView({block: "center"});', element);
    try {
      await element.click();
    } catch {
      // Elementos como anúncios podem sobrepor o alvo e interceptar o clique nativo.
      await this.driver.executeScript('arguments[0].click();', element);
    }
  }

  protected async type(locator: By, text: string): Promise<void> {
    const element = await this.find(locator);
    await element.clear();
    await element.sendKeys(text);
  }

  // Escolhe a opção pelo texto exato. Digitar no <select> com sendKeys depende da
  // busca por digitação do browser e, se o texto não bate com nenhuma opção,
  // deixa outra selecionada sem erro; aqui uma opção inexistente falha na hora.
  protected async select(locator: By, visibleText: string): Promise<void> {
    const element = await this.find(locator);
    await new Select(element).selectByVisibleText(visibleText);
  }

  protected async getText(locator: By): Promise<string> {
    const element = await this.find(locator);
    return element.getText();
  }

  protected async isVisible(locator: By, timeout = DEFAULT_TIMEOUT): Promise<boolean> {
    try {
      const element = await this.driver.wait(until.elementLocated(locator), timeout);
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  async open(url: string): Promise<void> {
    await this.driver.get(url);
  }
}
