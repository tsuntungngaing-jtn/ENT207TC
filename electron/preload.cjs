const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('fuxiDesktop', {
  version: '1.0.0',
})
