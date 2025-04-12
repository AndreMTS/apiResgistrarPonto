const express = require('express');
const { registerPonto } = require('./puppeteerHelper');

function startAPI() {
  const app = express();
  const port = 3000;

  app.use(express.json());

  // Use um prefixo "/api"
  const router = express.Router();

  router.post('/registrar-ponto', async (req, res) => {
    console.log('➡️ Chamada recebida em /api/registrar-ponto');
    const { employerCode, pin } = req.body;

    if (!employerCode || !pin) {
      return res.status(400).json({ error: 'Parâmetros faltando' });
    }

    try {
      await registerPonto(employerCode, pin);
      res.status(200).json({ status: 'Ponto registrado com sucesso!' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar ponto.' });
    }
  });

  app.use('/api', router); // Prefixo adicionado aqui

  app.listen(port, () => {
    console.log(`✅ API rodando em http://localhost:${port}`);
  });
}

module.exports = startAPI;
