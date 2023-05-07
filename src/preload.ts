const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: (fileOrDir) => ipcRenderer.invoke('dialog:openFile', fileOrDir),
  // parseFiles: (dir) => ipcRenderer.invoke('parseFiles', dir),
  getAllRoutes: () => ipcRenderer.invoke('db:getAllRoutes'),
  getRoute: (route) => ipcRenderer.invoke('db:getRoute', route),
  getTest: (test) => ipcRenderer.invoke('db:getTest', test),
  copyConfig: (dir) => ipcRenderer.invoke('copyConfig', dir),
  startFEParseAndServer: () => ipcRenderer.invoke('startFEParseAndServer')
})
