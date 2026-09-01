import { Builder, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import edge from 'selenium-webdriver/edge';

export function createDriver(): WebDriver {
  const browser = process.env.BROWSER ?? 'chrome';
  const headless = process.env.HEADLESS === 'true';
  const windowSizeArg = '--window-size=1366,768';

  if (browser === 'edge') {
    const edgeOptions = new edge.Options();
    if (headless) {
      edgeOptions.addArguments('--headless=new');
    }
    edgeOptions.addArguments(windowSizeArg);
    return new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(edgeOptions).build();
  }

  const chromeOptions = new chrome.Options();
  if (headless) {
    chromeOptions.addArguments('--headless=new');
  }
  chromeOptions.addArguments(windowSizeArg);
  return new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
}
