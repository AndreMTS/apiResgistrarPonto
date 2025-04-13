const puppeteer = require('puppeteer');

async function registerPonto(employerCode, pin, logFn, headless = true) {
  // O parâmetro 'headless' vai definir se o Puppeteer será visível ou não
  const browser = await puppeteer.launch({ headless: headless }); // Aqui, passamos a variável headless
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
    await new Promise(resolve => setTimeout(resolve, 5000));

    logFn('✅ Ponto registrado com sucesso!');
  } catch (error) {
    logFn(`❌ Erro ao registrar ponto: ${error.message}`);
  } finally {
    await browser.close();
  }
}

module.exports = { registerPonto };
