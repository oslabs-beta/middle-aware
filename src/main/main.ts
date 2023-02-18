const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Middle-Aware',
    width: 800,
    height: 600,
  });

  mainWindow.webContents.openDevTools();

  mainWindow.loadURL('http://localhost:8080');
}

app.whenReady().then(createMainWindow);
