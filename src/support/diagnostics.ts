import { logging } from 'selenium-webdriver';
import { CustomWorld } from './world';

/**
 * Anexa ao relatório o estado do browser no momento da falha: screenshot, URL,
 * HTML da página e logs do console. Com isso dá para investigar uma falha do CI
 * só pelo relatório, sem precisar reproduzir localmente.
 *
 * Cada anexo é tentado de forma independente: se a sessão do browser estiver
 * quebrada e um deles falhar, o motivo vai para o relatório e os demais seguem.
 */
export async function attachFailureDiagnostics(world: CustomWorld): Promise<void> {
  const { driver } = world;

  await tryAttach(world, 'screenshot', async () => {
    world.attach(await driver.takeScreenshot(), 'base64:image/png');
  });

  await tryAttach(world, 'URL', async () => {
    world.attach(await driver.getCurrentUrl(), { mediaType: 'text/plain', fileName: 'url.txt' });
  });

  await tryAttach(world, 'HTML', async () => {
    world.attach(await driver.getPageSource(), {
      mediaType: 'text/html',
      fileName: 'pagina.html',
    });
  });

  await tryAttach(world, 'console', async () => {
    const entries = await driver.manage().logs().get(logging.Type.BROWSER);
    const lines = entries.map(
      (entry) =>
        `${new Date(entry.timestamp).toISOString()} [${entry.level.name}] ${entry.message}`,
    );
    world.attach(lines.length > 0 ? lines.join('\n') : '(nenhuma mensagem no console)', {
      mediaType: 'text/plain',
      fileName: 'console.log',
    });
  });
}

// Uma sessão de browser travada pode deixar uma chamada pendurada para sempre.
// O limite por anexo garante que o hook ainda chegue ao driver.quit() dentro
// do timeout do Cucumber.
const ATTACH_TIMEOUT = 5000;

async function tryAttach(
  world: CustomWorld,
  label: string,
  attach: () => Promise<void>,
): Promise<void> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`sem resposta em ${ATTACH_TIMEOUT} ms`)),
      ATTACH_TIMEOUT,
    );
  });
  try {
    await Promise.race([attach(), timeout]);
  } catch (error) {
    world.log(`Diagnóstico: não foi possível anexar ${label}: ${String(error)}`);
  } finally {
    clearTimeout(timer);
  }
}
