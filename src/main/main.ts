const { app, BrowserWindow } = require('electron')
const url = require('url')
const path = require('path')
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const parseAPIRequests = require('./parseAPIRequests');

let mainWindow;

function createMainWindow () {
  const mainWindow = new BrowserWindow({
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Middle-Aware',
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts'),
    },
  });

  // show devtools
  // mainWindow.webContents.openDevTools();

  mainWindow.loadURL('http://localhost:8080')
}

app.whenReady().then(createMainWindow)
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
}

async function handleFileParse(event, dir) {
  return await parseAPIRequests(dir);
}

app.whenReady().then(() => {
  createMainWindow();
  ipcMain.handle('dialog:openFile', handleFileOpen);
  ipcMain.handle('parseFiles', handleFileParse);
});
