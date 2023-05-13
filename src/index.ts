import configManager, { readConfig } from './configManager'
import { mongoConnect } from './dbModels'
import instrumentController from './instrumentController'
import filesController from './filesController'
const proxyServer = require('./proxyServer')
require('source-map-support').install()
const session = require('electron').session
const { BrowserWindow, dialog, ipcMain, app } = require('electron')
const path = require('path')
const { shell } = require('electron')
const db = require('./dbController')
const parseAPIRequests = require('./parseAPI-FE-Req')
const fs = require('fs')
const tcpPortUsed = require('tcp-port-used')
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow: any

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: 'Middle-Aware',
    width: 1024,
    minWidth: 1000,
    height: 768,
    minHeight: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
    show: false // Added to prevent focus change on reload during development
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  mainWindow.showInactive() // Added to prevent focus change on reload during development
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // session.defaultSession.setProxy({
  //   proxyRules: 'http://127.0.0.1:9000'
  //   // proxyBypassRules: 'localhost'
  // })

  console.log('MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY:', MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY)

  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // Commenting out the following line to address issue where IPC channels are not loaded before window
  // if (BrowserWindow.getAllWindows().length === 0) {
  //   createWindow()
  // }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

async function handleFileOpen (event, fileOrDir) {
  console.log('fileOrDir: ', fileOrDir)
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, { properties: [(fileOrDir === 'directory' ? 'openDirectory' : 'openFile')] })
  if (canceled) {
    //
  } else {
    return filePaths[0]
  }
}

function documentation () {
  // const docWindow = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   webPreferences: {
  //     nodeIntegration: false // disable node integration to improve security
  //   }
  // })
  // docWindow.loadFile('a documentation html file')
  shell.openExternal('https://github.com/oslabs-beta/middle-aware/blob/main/README.md')
}

async function handleGetRoute (event, route) { return await db.default.getRoute(route) }

async function handleGetTest (event, test) { return await db.default.getTest(test) }

function handleReadConfig () { return configManager.readConfig() }

function handleCopyConfig (event, dir) {
  configManager.copyConfig(dir)
  mongoConnect()
}

async function handleStartFEParseAndServer () {
  const server = { status: true, error: null }
  const parsedAPI = { body: null, error: null }
  const { proxyPort, frontEnd } = configManager.readConfig()
  // MIGHT BE ABLE TO INCLUDE ALL THIS LOGIC IN server.on('error', (error) => {})
  try {
    // Undefined, null, and 0 port values are not acceptable
    // This could be its own module
    if (proxyPort === undefined) {
      throw new Error('Proxy port cannot be undefined')
    } else if (proxyPort === null) {
      throw new Error('Proxy port cannot be null')
    } else if (typeof (proxyPort) !== 'number') {
      throw new Error('Proxy port must be an integer type')
    } else if (proxyPort <= 0) {
      throw new Error('Proxy port must be greater than 0')
    }
    await tcpPortUsed.check(proxyPort, '127.0.0.1').then((inUse) => {
      if (inUse) { throw new Error(`Proxy port is in use: ${proxyPort}`) }
    })

    proxyServer.listen(proxyPort, () => {
      console.log(`Proxy is listening on port ${proxyPort}`)
    })
  } catch (err) {
    server.status = false
    server.error = err
  }
  // parseAPIRequests is valid, then routes = its evaluated result, else is error information
  // Possible errors: Not a string, invalid directory (doesn't exist), undefined, null

  try {
    if (frontEnd === undefined) {
      throw new Error('Frontend path cannot be undefined')
    } else if (frontEnd === null) {
      throw new Error('Frontend path cannot be null')
    } else if (typeof (frontEnd) !== 'string') {
      throw new Error('Frontend path must be string type')
    } else if (frontEnd === '') {
      throw new Error('Frontend path cannot be an empty string')
    } else if (!fs.existsSync(frontEnd)) {
      throw new Error('Frontend path does not exist')
    }
    parsedAPI.body = parseAPIRequests(frontEnd)
  } catch (err) {
    parsedAPI.error = err
  }
  // this will return either the error or the routes
  return { server, parsedAPI }
}

function handleStartInstrumentation () {
  try {
    const { backEnd, backEndPort, frontEndPort, targetDir, rootDir, startScript, proxyPort } = readConfig()

    instrumentController.killPorts([`:${frontEndPort.toString()}`, `:${backEndPort.toString()}`])

    // make shadow copy of directory
    instrumentController.makeShadow(rootDir, targetDir)

    // get array of relevant files to parse from shadow directory
    // import dirRecursiveContents and run itfrom filesController
    // get the shadowBackend by getting the path difference between rootDir and the backend
    // the difference is then appended to the targetDir
    const relativeBackEnd = path.relative(rootDir, backEnd)
    let shadowBackEnd

    if (process.platform === 'linux' || process.platform === 'darwin') {
      shadowBackEnd = `${targetDir}/${relativeBackEnd}`
    } else if (process.platform === 'win32') {
      shadowBackEnd = `${targetDir}\\${relativeBackEnd}`
    }
    const arrJSFiles = filesController.dirRecursiveContents(shadowBackEnd !== '' ? shadowBackEnd : targetDir, [], ['.js'])

    // instrument those files
    for (const file of arrJSFiles) {
      const code = instrumentController.transformFile(file, proxyPort)
      instrumentController.modifyShadowFile(file, code)
    }
    // // import instrument and feed it the output of dirRecursiveContents, wihle iterating through the dirRecursiveContents array

    // execute shadow project
    // run start shadow
    instrumentController.startShadow(targetDir, startScript)
    return { status: true, message: 'Instrumentation completed successfully' }
  } catch (err) {
    return { status: false, message: err }
  }
}
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('db:getAllRoutes', db.default.getAllRoutes)
  ipcMain.handle('db:getRoute', handleGetRoute)
  ipcMain.handle('db:getTest', handleGetTest)
  ipcMain.handle('openDocs', documentation)
  ipcMain.handle('readConfig', handleReadConfig)
  ipcMain.handle('copyConfig', handleCopyConfig)
  ipcMain.handle('startFEParseAndServer', handleStartFEParseAndServer)
  ipcMain.handle('startInstrumentation', handleStartInstrumentation)
})

// setTimeout(() => handleStartFEParseAndServer(), 500)
// setTimeout(() => handleStartInstrumentation(), 10000)
