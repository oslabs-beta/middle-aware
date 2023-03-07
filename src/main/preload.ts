const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  parseFiles: (dir) => ipcRenderer.invoke('parseFiles', dir),
  newItem: (item) => ipcRenderer.invoke('new-item', item)
})

contextBridge.exposeInMainWorld('myAPI', {
  sendFormDataToMain: (testData) => {
    ipcRenderer.send('submit-form-data', testData)
  }
})
