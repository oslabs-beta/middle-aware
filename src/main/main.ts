const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Middle-Aware',
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts'),
    },
  });

  //show devtools
  //mainWindow.webContents.openDevTools();

  mainWindow.loadURL('http://localhost:8080');
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (canceled) {
    return;
  } else {
    return filePaths[0];
  }
}

app.whenReady(() => {
  createMainWindow();
  ipcMain.handle('dialog:openFile', handleFileOpen);
});
