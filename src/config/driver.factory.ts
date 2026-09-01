import { Builder, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import edge from 'selenium-webdriver/edge';

const BLOCKED_AD_URL_PATTERNS = [
  '*doubleclick.net*',
  '*googlesyndication*',
  '*googleadservices*',
  '*google.com/pagead*',
];

export async function createDriver(): Promise<WebDriver> {
  const browser = process.env.BROWSER ?? 'chrome';
  const headless = process.env.HEADLESS === 'true';
  const windowSizeArg = '--window-size=1366,768';

  let driver: WebDriver;
  if (browser === 'edge') {
    const edgeOptions = new edge.Options();
    if (headless) {
      edgeOptions.addArguments('--headless=new');
    }
    edgeOptions.addArguments(windowSizeArg);
    driver = await new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(edgeOptions).build();
  } else {
    const chromeOptions = new chrome.Options();
    if (headless) {
      chromeOptions.addArguments('--headless=new');
    }
    chromeOptions.addArguments(windowSizeArg);
    driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
  }

  await blockAdDomains(driver);
  return driver;
}

/**
 * O site alvo é monetizado com anúncios (incluindo interstitials do tipo
 * "vignette") que sobrepõem a página e interceptam cliques/navegações reais.
 * Bloquear os domínios de anúncio via CDP evita esse ruído nos testes.
 */
async function blockAdDomains(driver: WebDriver): Promise<void> {
  const cdp = await driver.createCDPConnection('page');
  await cdp.send('Network.enable', {});
  await cdp.send('Network.setBlockedURLs', { urls: BLOCKED_AD_URL_PATTERNS });
}
