const { app, BrowserWindow, dialog, ipcMain } = require('electron')
// const url = require('url')
const path = require('path')
const parseAPIRequests = require('./parseAPIRequests')
const mongoose = require('mongoose')
const Item = require('./testModel')
const MONGODB_URI = 'mongodb+srv://justinwmarchant:l9HPcrjosl0h4tFr@middle-aware-cluster.8frnuhl.mongodb.net/Middle-Aware?retryWrites=true&w=majority'

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected')
  })
  .catch(() => {
    console.log('not connected')
  })

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
  // mainWindow.webContents.openDevTools()

  mainWindow.loadURL('http://localhost:8080')
}

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
})

// app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
//   event.preventDefault()
//   // eslint-disable-next-line n/no-callback-literal
//   callback(true)
// })

// handles data sent from front end and saves to mongo db
// ipcMain.handle('new-item', async (e, item) => {
// const {name, message} = item
//   const newItem = new Item(item)
//   const savedItem = await newItem.save()
//   console.log('savedItem:', savedItem)
//   const stringified = JSON.stringify(savedItem)

//   return stringified
// })

ipcMain.on('submit-form-data', async (e, testData) => {
  console.log('please work')
  const newItem = new Item(testData)
  const savedItem = await newItem.save()
  console.log('savedItem:', savedItem)
  const stringified = JSON.stringify(savedItem)

  return stringified
})
