import { Builder, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import edge from 'selenium-webdriver/edge';

const BLOCKED_AD_URL_PATTERNS = [
  '*doubleclick.net*',
  '*googlesyndication*',
  '*googleadservices*',
  '*google.com/pagead*',
];

// Necessários para o Chromium (base do Chrome e do Edge) rodar em containers de CI,
// onde o sandbox padrão do navegador não tem permissão para inicializar.
const CI_HARDENING_ARGS = ['--no-sandbox', '--disable-dev-shm-usage'];

export async function createDriver(): Promise<WebDriver> {
  const browser = process.env.BROWSER ?? 'chrome';
  const headless = process.env.HEADLESS === 'true';
  const commonArgs = [...CI_HARDENING_ARGS, '--window-size=1366,768'];

  let driver: WebDriver;
  if (browser === 'edge') {
    const edgeOptions = new edge.Options();
    if (headless) {
      edgeOptions.addArguments('--headless=new');
    }
    edgeOptions.addArguments(...commonArgs);
    driver = await new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(edgeOptions).build();
  } else {
    const chromeOptions = new chrome.Options();
    if (headless) {
      chromeOptions.addArguments('--headless=new');
    }
    chromeOptions.addArguments(...commonArgs);
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
