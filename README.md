# API API Puppeteer Tangerino - Registro de Ponto Automatizado

Este projeto implementa uma aplicação baseada em **ElectronJS** e **Express** para registrar pontos automaticamente no sistema **Tangerino**. A aplicação utiliza **Puppeteer** para interagir com a página do Tangerino e realizar o registro de ponto de forma automatizada, sem a necessidade de intervenção manual.

## Funcionalidades

- **API Express**: Exposição de uma API REST para registrar o ponto utilizando código do empregador e PIN fornecidos pelo usuário.
- **Integração com Puppeteer**: Navegação automática no sistema Tangerino para registrar o ponto com um simples envio de dados via POST.
- **Interface Visual com Electron**: Interface gráfica que exibe informações sobre o status da API e logs de atividades em tempo real.
- **Modo Tray**: A aplicação pode ser minimizada para a bandeja do sistema, permitindo o funcionamento em segundo plano sem ocupar espaço na tela.
- **Configuração da Porta**: Possibilidade de alterar a porta onde a API está rodando diretamente pela interface.
- **Reinício da API**: Capacidade de reiniciar a API sem fechar a aplicação, mantendo o serviço contínuo.
- **Exibição de Logs**: Logs da execução da API são mostrados em tempo real na interface, proporcionando uma visão clara das atividades realizadas.

## Como Funciona

1. **Inicie a Aplicação**: Ao iniciar a aplicação, a interface gráfica será aberta, informando que a API está rodando em uma porta específica (padrão: `3000`).
2. **Registre o Ponto**: A API estará disponível na URL `http://localhost:3000/api/v1/registrar-ponto`. Envie uma requisição POST com os parâmetros `employerCode` e `pin` para registrar o ponto no sistema Tangerino.
3. **Acompanhe o Status**: O status da API, a porta atual, e os logs da execução são exibidos na interface. Também é possível reiniciar a API diretamente pela interface.
4. **Modo Tray**: Você pode minimizar a aplicação para a bandeja do sistema, mantendo-a em funcionamento sem ocupar espaço na tela.

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/api-tangerino.git
cd api-tangerino
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie a aplicação:

```bash
npm start
```

A aplicação estará rodando na porta `3000` por padrão. Você pode acessar a API no endpoint `http://localhost:3000/api/v1/registrar-ponto`.

## Tecnologias Usadas

- **ElectronJS**: Para a criação da interface gráfica e controle da janela da aplicação.
- **Express**: Para criar a API REST.
- **Puppeteer**: Para automação no navegador e registro de ponto no Tangerino.
- **Node.js**: Para execução do backend e lógica de comunicação com o Tangerino.

## Contribuições

Sinta-se à vontade para contribuir com melhorias e correções. Se você encontrar algum bug ou tiver uma sugestão, abra um *issue* ou envie um *pull request*.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Você pode adicionar ou ajustar conforme as suas necessidades.