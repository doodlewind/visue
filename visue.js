const fs = require('fs')
const {dialog} = require('electron').remote
const storeEditor = require('./core/editors/store')

window.visue = {
  getActions (cb) {
    dialog.showOpenDialog({
      properties: ['openFile']
    }, filePath => {
      if (!filePath) {
        cb(null)
        return
      }
      const file = fs.readFileSync(filePath[0], 'utf-8')
      storeEditor.parse(file)
      cb(storeEditor.getActionsIndex())
    })
  }
}
