const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  parseFiles: (dir) => ipcRenderer.invoke('parseFiles', dir),
  getAllRoutes: () => ipcRenderer.invoke('db:getAllRoutes'),
  getRoute: (route) => ipcRenderer.invoke('db:getRoute', route),
  getTest: (test) => ipcRenderer.invoke('db:getTest', test),
  documentation: () => ipcRenderer.invoke('openDocs')
})
