const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { startAPI, stopAPI } = require('./api');

let mainWindow;
let tray = null;
let currentPort = 3000;
let apiRunning = false;

// Caminho do config.json
const configPath = path.join(__dirname, 'config.json');

function loadConfig() {
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath));
    currentPort = config.port || 3000;
  } else {
    fs.writeFileSync(configPath, JSON.stringify({ port: currentPort }, null, 2));
  }
}

function saveConfig(port) {
  fs.writeFileSync(configPath, JSON.stringify({ port }, null, 2));
}

function sendStatus() {
  if (mainWindow) {
    mainWindow.webContents.send('porta-api', currentPort);
    mainWindow.webContents.send('status-api', apiRunning ? '🟢 Ativa' : '🔴 Inativa');
  }
}

function sendLog(log) {
  if (mainWindow) {
    mainWindow.webContents.send('log-api', log);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
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
    await startAPI(port, sendLog);
    apiRunning = true;
    currentPort = port;
    saveConfig(port);
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

app.whenReady().then(() => {
  loadConfig();
  createWindow();
  createTray();
  startOrRestartAPI(currentPort);
});

app.on('window-all-closed', (e) => e.preventDefault());
