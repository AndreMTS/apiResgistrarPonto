## Tangerino Automator - API de Registro de Ponto

Aplicação Electron com Puppeteer para registro automatizado no sistema Tangerino via API REST.

## 🌟 Funcionalidades Principais

### Automação Completa

*   🤖 Navegação automática no Tangerino via Puppeteer
*   📅 Registro de pontos com código do empregador e PIN
*   🔄 Atualização de status em tempo real

### Interface Amigável

*   🖥️ Painel de controle com logs de atividades
*   🚦 Indicador visual do status da API
*   ⚙️ Controles de configuração fácil

### Funcionalidades Avançadas

*   🔄 Reinício dinâmico da API
*   🔌 Alteração de porta sem reiniciar o app
*   📌 Modo tray para execução em segundo plano

## 🚀 Como Funciona

1.  **Backend API** (Node.js/Express)
    *   Endpoint POST `/api/v1/registrar-ponto`
    *   Processa as credenciais
    *   Dispara a automação via Puppeteer
2.  **Frontend Electron**
    *   Interface gráfica de controle
    *   Exibição de logs em tempo real
    *   Gerenciamento de configurações
3.  **Integração**
    *   Comunicação segura entre componentes
    *   Feedback visual imediato

## 📦 Instalação

```plaintext
git clone https://github.com/seu-usuario/api-tangerino.git
cd api-tangerino
npm install
npm start
```

## ⚙️ Configuração

1.  **Porta da API**
    *   Padrão: 3000
    *   Alterável via interface gráfica
2.  **Credenciais**
    *   Enviadas via POST para a API
    *   Armazenadas apenas em memória
3.  **Tray Icon**
    *   Clique direito para opções
    *   Duplo clique para restaurar janela

## 🛠️ Tecnologias Utilizadas

*   **EletronJS** - Framework para aplicação desktop
*   **Puppeteer** - Automação de navegador
*   **Express** - Servidor API REST
*   **Node.js** - Ambiente de execução

## 🔌 Uso com Extensão Chrome

Esta aplicação é projetada para funcionar em conjunto com a [extensão Chrome Bateu Ponto](URL_DA_EXTENSAO).

1.  Inicie esta aplicação
2.  Configure a extensão com:
    *   URL: `http://localhost:3000/api/v1/registrar-ponto`
    *   Mesma porta configurada aqui

## 🐛 Solução de Problemas

### Problemas Comuns:

1.  API não responde:
    *   Verifique se o Electron está rodando
    *   Confira a porta configurada
2.  Registro falha:
    *   Confira as credenciais no Tangerino
    *   Verifique os logs de erro

## 🤝 Contribuição

1.  Faça um fork do projeto
2.  Crie sua branch (`git checkout -b feature/nova-feature`)
3.  Commit suas mudanças (`git commit -am 'Add new feature'`)
4.  Push para a branch (`git push origin feature/nova-feature`)
5.  Abra um Pull Request

## 📄 Licença

MIT - Veja o arquivo [LICENSE](LICENSE) para detalhes.