const acorn = require('acorn')
const walk = require('acorn/dist/walk')
const utils = require('../utils')

let ast = null
let src = ''

// parse source code to AST
function parse (source) {
  src = source
  ast = acorn.parse(src, {sourceType: 'module'})
  return ast
}

// returns { imported: [], exported: { start, end } }
// imported is array of Vuex module import statement structrue
// each import node contains name / source / start / end props
// exported is starting and ending position of module statement
// inside Vuex Store export statement
function getEntryModules () {
  let imported = []
  let exported = { start: null, end: null }
  walk.simple(ast, {
    ImportDeclaration (node) {
      if (node.source.value.indexOf('modules') > -1) {
        imported.push({
          name: node.specifiers[0].local.name,
          source: node.source.value,
          start: node.start,
          end: node.end
        })
      }
    },
    ExportDefaultDeclaration (node) {
      let storeArgs = node.declaration.arguments[0].properties
      let exportModules = storeArgs.find(arg => arg.key.name === 'modules')
      exported.start = exportModules.start
      exported.end = exportModules.end
    }
  })
  return {
    imported,
    exported
  }
}

// edit and return Vuex Store entry source code fragment
// according to modules args and new module newModuleNames
// obtained by getEntryModules method
// oldModules is args return by getEntryModules method
// newModuleNames is string array in form of ['users', 'blogs']
function setEntryByModules (src, oldModules, newModuleNames) {
  // replace module declarations in
  // tailing Vuex Store export statement
  let [start, end] = [oldModules.exported.start, oldModules.exported.end]
  let code = newModuleNames.map(name => '    ' + name).join(',\n')
  src = utils.replaceByIndex(src, `modules: {\n${code}\n  }`, start, end)

  // replace all import statements
  // from starting position of first import statement
  // to ending position of last import statement
  const importStart = oldModules.imported.length > 0
    ? oldModules.imported[0].start : 0
  const importEnd = oldModules.imported.length > 0
    ? oldModules.imported[oldModules.imported.length - 1].end : 0

  code = newModuleNames.map(name => {
    return `import ${name} from './modules/${name}'`
  }).join('\n')

  if (importEnd === 0) code += '\n'
  src = utils.replaceByIndex(src, code, importStart, importEnd)
  return src
}

// encapsulate private set method
// newModules is string array in form of ['users', 'blogs']
function setEntryModules (newModules) {
  let oldModules = getEntryModules()
  return setEntryByModules(src, oldModules, newModules)
}

// return state declaration code fragment in Vuex modules
function getStateIndex () {
  const index = {start: null, end: null}
  walk.simple(ast, {
    VariableDeclaration (node) {
      // only support basic declaration statement
      if (node.declarations.length !== 1) return
      if (node.declarations[0].id.name === 'state') {
        index.start = node.start
        index.end = node.end
      }
    }
  })
  return index
}

// return object from state literal string
function getStateObject () {
  const index = getStateIndex()
  let stateCode = utils.getCode(src, index.start, index.end).split('=')[1]
  return utils.getObject(stateCode)
}

// replace state declaration code
function setState (code) {
  const index = getStateIndex()
  return utils.replaceByIndex(src, code, index.start, index.end)
}

// return action declaration code fragment in Vuex modules
// the actions array contains each action function code index
function getActionsIndex () {
  const index = {start: null, end: null, actions: []}
  walk.simple(ast, {
    VariableDeclaration (node) {
      if (node.declarations.length !== 1) return
      if (node.declarations[0].id.name === 'actions') {
        index.start = node.start
        index.end = node.end
        node.declarations[0].init.properties.forEach(prop =>
          index.actions.push({
            name: prop.key.name,
            stant: prop.start,
            end: prop.end
          }))
      }
    }
  })
  return index
}

// replace action declaration code
function setActions (code) {
  const index = getActionsIndex()
  return utils.replaceByIndex(src, code, index.start, index.end)
}

module.exports = {
  parse,
  getEntryModules,
  setEntryModules,
  getStateObject,
  setState,
  getActionsIndex,
  setActions
}
