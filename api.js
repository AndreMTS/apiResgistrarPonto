const express = require('express');
const { registerPonto } = require('./puppeteerHelper');

let server = null;

function startAPI(port = 3000, logFn = console.log, visualizarPuppeteer = false) {
  return new Promise((resolve, reject) => {
    const app = express();
    app.use(express.json());

    app.post('/v1/registrar-ponto', async (req, res) => {
      const { employerCode, pin } = req.body;

      if (!employerCode || !pin) {
        logFn('⚠️ Requisição incompleta.');
        return res.status(400).json({ error: 'Parâmetros faltando' });
      }

      try {
        logFn(`📩 Requisição recebida para código: ${employerCode}`);
        await registerPonto(employerCode, pin, logFn, visualizarPuppeteer); // Passando a visibilidade do Puppeteer
        logFn('✅ Ponto registrado com sucesso!');
        res.status(200).json({ status: 'Ponto registrado com sucesso!' });
      } catch (error) {
        logFn(`❌ Erro ao registrar ponto: ${error.message}`);
        res.status(500).json({ error: 'Erro ao registrar ponto.' });
      }
    });

    server = app.listen(port, () => {
      logFn(`✅ API rodando em http://localhost:${port}`);
      resolve();
    });

    server.on('error', (err) => {
      reject(err);
    });
  });
}

function stopAPI() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => {
        server = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = { startAPI, stopAPI };
