
require('source-map-support').install()
const parseAPIRequests = require('./parseAPI-FE-Req')
const session = require('electron').session
const { BrowserWindow, dialog, ipcMain, app } = require('electron')
const path = require('path')
const db = require('./dbController')

let mainWindow

function createMainWindow () {
  mainWindow = new BrowserWindow({
    title: 'Middle-Aware',
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js') // This must be .js to account for the compiled version
    },
    show: false // Added to prevent focus change on reload during development
  })

  // show devtools
  // mainWindow.webContents.openDevTools()

  mainWindow.loadURL('http://localhost:8080')
  mainWindow.showInactive() // Added to prevent focus change on reload during development
}

app.whenReady().then(() => {
  session.defaultSession.setProxy({
    proxyRules: 'http://127.0.0.1:9000'
    // proxyBypassRules: 'localhost'
  })

  createMainWindow()
})
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

function handleFileParse (event, dir) {
  return parseAPIRequests(dir)
}

async function handleGetRoute (event, route) {
  return await db.getRoute(route)
}

async function handleGetTest (event, test) {
  return await db.getTest(test)
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('parseFiles', handleFileParse)
  ipcMain.handle('db:getAllRoutes', db.getAllRoutes)
  ipcMain.handle('db:getRoute', handleGetRoute)
  ipcMain.handle('db:getTest', handleGetTest)
})
