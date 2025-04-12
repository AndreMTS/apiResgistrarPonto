const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const startAPI = require('./api');

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 450,
    resizable: false,
    icon: path.join(__dirname, 'icon.jpg'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  // Ao minimizar, esconde a janela
  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // Ao fechar (clicar no X), esconde a janela ao invés de encerrar o app
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'icon.jpg'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar',
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: 'Sair',
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('API Tangerino Ponto');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  startAPI(); // Inicia a API Express
});

// Mantém o app rodando mesmo com todas as janelas fechadas
app.on('window-all-closed', (e) => {
  // Impede o fechamento completo da aplicação
  e.preventDefault();
});
