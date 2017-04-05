const parse5 = require('parse5')
const utils = require('../utils')

let ast = null

// parse source template code to AST
function parse (html) {
  ast = parse5.parseFragment(html, {locationInfo: true})
}

// traverse ast dom node and convert format
function traverse (node) {
  let newNode = {
    attrs: (node.attrs && node.attrs.length) ? node.attrs : [],
    value: node.value || null,
    nodeName: node.nodeName,
    location: node.__location,
    childNodes: []
  }
  if (node.childNodes && node.childNodes.length) {
    node.childNodes.forEach(node =>
      newNode.childNodes.push(traverse(node)))
  } else if (node.content && node.content.childNodes) {
    node.content.childNodes.forEach(node =>
      newNode.childNodes.push(traverse(node)))
  }
  return newNode
}

// public api
function getTree () {
  let tmpNode = ast.childNodes.filter(n => n.nodeName === 'template')
  if (!tmpNode.length) return null
  return traverse(tmpNode[0])
}

function getNodeText (html, location) {
  return utils.getCode(html, location.startOffset, location.endOffset)
}

function setNodeText (html, location, text) {
  return utils.replaceByIndex(
    html,
    text,
    location.startOffset,
    location.endOffset
  )
}

module.exports = {
  parse,
  getTree,
  getNodeText,
  setNodeText
}
