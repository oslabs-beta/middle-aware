const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: (fileOrDir) => ipcRenderer.invoke('dialog:openFile', fileOrDir),
  getAllRoutes: () => ipcRenderer.invoke('db:getAllRoutes'),
  getRoute: (route) => ipcRenderer.invoke('db:getRoute', route),
  getTest: (test) => ipcRenderer.invoke('db:getTest', test),
  documentation: () => ipcRenderer.invoke('openDocs'),
  copyConfig: (dir) => ipcRenderer.invoke('copyConfig', dir),
  startFEParseAndServer: () => ipcRenderer.invoke('startFEParseAndServer'),
  startInstrumentation: () => ipcRenderer.invoke('startInstrumentation')
})
