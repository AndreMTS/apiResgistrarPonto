const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { startAPI, stopAPI } = require('./api');

let mainWindow;
let tray = null;
let currentPort = 3000;
let apiRunning = false;
let visualizarPuppeteer = false; // Variável que controla se o Puppeteer será visível ou não

// Caminho do config.json
const configPath = path.join(__dirname, 'config.json');

function loadConfig() {
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath));
    currentPort = config.port || 3000;
    visualizarPuppeteer = config.visualizarPuppeteer || false; // Carrega a configuração de visibilidade do Puppeteer
  } else {
    fs.writeFileSync(configPath, JSON.stringify({ port: currentPort, visualizarPuppeteer }, null, 2));
  }
}

function saveConfig() {
  fs.writeFileSync(configPath, JSON.stringify({ port: currentPort, visualizarPuppeteer }, null, 2));
}

function sendStatus() {
  if (mainWindow) {
    mainWindow.webContents.send('porta-api', currentPort);
    mainWindow.webContents.send('status-api', apiRunning ? '🟢 Ativa' : '🔴 Inativa');
    mainWindow.webContents.send('visualizacao-puppeteer', visualizarPuppeteer);
  }
}

function sendLog(mensagem) {
  const data = new Date().toLocaleTimeString();
  const fullMsg = `[${data}] ${mensagem}<br>`;
  mainWindow.webContents.send('log-api', fullMsg);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    resizable: false,
    icon: path.join(__dirname, 'icon.jpg'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

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
    { label: 'Mostrar', click: () => mainWindow.show() },
    { label: 'Sair', click: () => {
        app.isQuiting = true;
        stopAPI();
        app.quit();
      }},
  ]);

  tray.setToolTip('API Tangerino Ponto');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.show();
  });
}

async function startOrRestartAPI(port) {
  if (apiRunning) {
    await stopAPI();
    sendLog(`🔁 Reiniciando API na porta ${port}...`);
  } else {
    sendLog(`🚀 Iniciando API na porta ${port}...`);
  }

  try {
    await startAPI(port, sendLog, visualizarPuppeteer); // Passando a variável visualizarPuppeteer para o API
    apiRunning = true;
    currentPort = port;
    saveConfig();
  } catch (err) {
    apiRunning = false;
    sendLog(`❌ Erro ao iniciar API: ${err.message}`);
  }

  sendStatus();
}

ipcMain.on('solicitar-status', () => {
  sendStatus();
});

ipcMain.on('reiniciar-api', (_, novaPorta) => {
  const porta = parseInt(novaPorta, 10) || currentPort;
  startOrRestartAPI(porta);
});

// Adicionando IPC para alterar a visibilidade do Puppeteer
ipcMain.on('alterar-visualizacao-puppeteer', (_, visualizar) => {
  visualizarPuppeteer = visualizar;
  saveConfig(); // Salva a nova configuração
  console.log(`Exibição do Puppeteer: ${visualizarPuppeteer ? 'Visível' : 'Oculto'}`);
});

app.whenReady().then(() => {
  loadConfig();
  createWindow();
  createTray();
  startOrRestartAPI(currentPort);
});

app.on('window-all-closed', (e) => e.preventDefault());
