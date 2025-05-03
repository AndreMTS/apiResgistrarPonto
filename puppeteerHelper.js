const puppeteer = require('puppeteer');

async function registerPonto(employerCode, pin, logFn, headless = true) {
  const browser = await puppeteer.launch({
    headless: headless,
    args: [
      '--use-fake-ui-for-media-stream', // Bloqueia prompt de câmera/mic
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const context = browser.defaultBrowserContext();

  // Bloqueia explicitamente permissões para câmera e microfone
  await context.overridePermissions('https://app.tangerino.com.br', []);

  const page = await browser.newPage();

  try {
    logFn('🔍 Iniciando processo de registro de ponto...');

    await page.goto('https://app.tangerino.com.br/Tangerino', {
      waitUntil: 'domcontentloaded'
    });

    logFn('🌍 Página carregada, acessando a área de registro de ponto...');

    await page.waitForSelector('a.login-aba[href*="baterPonto"]');
    await page.click('a.login-aba[href*="baterPonto"]');

    logFn('🖱️ Clicando para registrar ponto...');

    await page.waitForSelector('#formCodigoEmpregadorPin', { visible: true });

    logFn('⌨️ Preenchendo os dados...');
    await page.type('#codigoEmpregador', employerCode);
    await page.type('#codigoPin', pin);
    await page.click('#registraPonto');

    logFn('⏳ Aguardando o processo de registro...');
    await new Promise(resolve => setTimeout(resolve, 7000));

    logFn('✅ Ponto registrado com sucesso!');
  } catch (error) {
    logFn(`❌ Erro ao registrar ponto: ${error.message}`);
  } finally {
    await browser.close();
  }
}

module.exports = { registerPonto };
