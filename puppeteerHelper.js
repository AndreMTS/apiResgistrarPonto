const puppeteer = require('puppeteer');

async function registerPonto(employerCode, pin) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('https://app.tangerino.com.br/Tangerino', {
      waitUntil: 'domcontentloaded'
    });

    await page.waitForSelector('a.login-aba[href*="baterPonto"]');
    await page.click('a.login-aba[href*="baterPonto"]');

    await page.waitForSelector('#formCodigoEmpregadorPin', { visible: true });

    await page.type('#codigoEmpregador', employerCode);
    await page.type('#codigoPin', pin);
    await page.click('#registraPonto');

    await page.waitForTimeout(5000);
    console.log('✅ Ponto registrado com sucesso');

  } catch (error) {
    console.error('❌ Erro ao registrar ponto:', error);
  } finally {
    await browser.close();
  }
}

module.exports = { registerPonto };
