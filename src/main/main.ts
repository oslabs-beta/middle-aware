const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const session = require('electron').session;

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Middle-Aware',
    width: 800,
    height: 600,
  });

  //show devtools
  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL('http://localhost:8080');
}

app.whenReady().then(() => {
  session.defaultSession.setProxy({
    proxyRules: 'http://127.0.0.1:9000',
    // proxyBypassRules: 'localhost'
  });

  createMainWindow();
});
