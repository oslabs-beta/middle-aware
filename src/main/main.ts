const session = require('electron').session
const { BrowserWindow, dialog, ipcMain, app } = require('electron')
const url = require('url')
const path = require('path')
const parseAPIRequests = require('./parseAPIRequests')
const db = require('./dbController')

let mainWindow

function createMainWindow () {
  mainWindow = new BrowserWindow({
    title: 'Middle-Aware',
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts')
    }
  })

  // show devtools
  //mainWindow.webContents.openDevTools()

  mainWindow.loadURL('http://localhost:8080')
}

app.whenReady().then(() => {
  session.defaultSession.setProxy({
    proxyRules: 'http://127.0.0.1:9000',
    // proxyBypassRules: 'localhost'
  });

  createMainWindow();
});
async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  if (canceled) {
    //
  } else {
    return filePaths[0]
  }
}

async function handleFileParse (event, dir) {
  return await parseAPIRequests(dir)
}

app.whenReady().then(() => {
  createMainWindow()
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('parseFiles', handleFileParse)
  ipcMain.handle('db:getAllRoutes', db.getAllRoutes)
  ipcMain.handle('db:getRoute', db.getRoutes)
  ipcMain.handle('db:getTest', db.getTest)
})
