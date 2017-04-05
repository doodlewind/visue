const fs = require('fs')
const {dialog} = require('electron').remote
const storeEditor = require('./core/editors/store')
const templateEditor = require('./core/editors/template')

let lastFilePath = null
let lastFile = ''

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
  getTemplateCode (location) {
    lastFile = fs.readFileSync(lastFilePath, 'utf-8')
    return templateEditor.getNodeText(lastFile, location)
  },
  getTemplateInfo (cb) {
    dialog.showOpenDialog({
      properties: ['openFile']
    }, filePath => {
      if (!filePath) {
        cb(null)
        return
      }
      lastFilePath = filePath[0]
      lastFile = fs.readFileSync(lastFilePath, 'utf-8')
      templateEditor.parse(lastFile)
      cb(templateEditor.getTree())
    })
  },
  updateNodeValue (payload) {
    lastFile = fs.readFileSync(lastFilePath, 'utf-8')
    let html = templateEditor.setNodeText(
      lastFile,
      payload.location,
      payload.value
    )
    fs.writeFileSync(lastFilePath, html, 'utf-8')
    templateEditor.parse(html)
    return templateEditor.getTree()
  }
}
