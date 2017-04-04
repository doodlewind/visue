const fs = require('fs')
const {dialog} = require('electron').remote
const storeEditor = require('./core/editors/store')
const templateEditor = require('./core/editors/template')

window.visue = {
  getModuleInfo (cb) {
    dialog.showOpenDialog({
      properties: ['openFile']
    }, filePath => {
      if (!filePath) {
        cb(null)
        return
      }
      const file = fs.readFileSync(filePath[0], 'utf-8')
      storeEditor.parse(file)
      const states = Object.keys(storeEditor.getStateObject())
      const actions = storeEditor.getActionsIndex().actions
      cb({
        states,
        actions
      })
    })
  },
  getTemplateInfo (cb) {
    dialog.showOpenDialog({
      properties: ['openFile']
    }, filePath => {
      if (!filePath) {
        cb(null)
        return
      }
      const file = fs.readFileSync(filePath[0], 'utf-8')
      templateEditor.parse(file)
      cb(templateEditor.getTree())
    })
  }
}
