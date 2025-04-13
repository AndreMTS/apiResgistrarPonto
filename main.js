const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { startAPI, stopAPI } = require('./api');

let mainWindow;
let tray = null;
let currentPort = 3000;
let apiRunning = false;
let visualizarPuppeteer = false;
let configPath = ''; // Caminho do config externo

function getUserConfigPath() {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'config.json');
}

function loadConfig() {
  configPath = getUserConfigPath();

  if (!fs.existsSync(configPath)) {
    const defaultConfigPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(defaultConfigPath)) {
      fs.copyFileSync(defaultConfigPath, configPath);
    } else {
      // Cria um default se nem o modelo existir
      fs.writeFileSync(configPath, JSON.stringify({
        port: 3000,
        visualizarPuppeteer: false
      }, null, 2));
    }
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  // Atualiza as variáveis globais
  currentPort = config.port || 3000;
  visualizarPuppeteer = config.visualizarPuppeteer || false;

  return config;
}

function saveConfig() {
  const config = {
    port: currentPort,
    visualizarPuppeteer
  };

  if (configPath) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
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
    icon: path.join(__dirname, 'icon.png'),
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
  tray = new Tray(path.join(__dirname, 'icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Mostrar', click: () => mainWindow.show() },
    { label: 'Sair', click: () => {
        app.isQuiting = true;
        stopAPI();
        app.quit();
      }},
  ]);

  tray.setToolTip('API Puppeteer Tangerino Ponto');
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
    await startAPI(port, sendLog, visualizarPuppeteer);
    apiRunning = true;
    currentPort = port;
    saveConfig(); // Salva nova porta e estado de visualização
  } catch (err) {
    apiRunning = false;
    sendLog(`❌ Erro ao iniciar API: ${err.message}`);
  }

  sendStatus();
}

// Eventos do IPC

ipcMain.on('solicitar-status', () => {
  sendStatus();
});

ipcMain.on('reiniciar-api', (_, novaPorta) => {
  const porta = parseInt(novaPorta, 10) || currentPort;
  startOrRestartAPI(porta);
});

ipcMain.on('alterar-visualizacao-puppeteer', (_, visualizar) => {
  visualizarPuppeteer = visualizar;
  saveConfig();
  console.log(`Exibição do Puppeteer: ${visualizarPuppeteer ? 'Visível' : 'Oculto'}`);
});

// Início do app

app.whenReady().then(() => {
  loadConfig(); // Agora carrega e define valores no início
  createWindow();
  createTray();
  startOrRestartAPI(currentPort);
});

app.on('window-all-closed', (e) => e.preventDefault());
