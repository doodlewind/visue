const parse5 = require('parse5')

let ast = null

// parse source template code to AST
function parse (html) {
  ast = parse5.parseFragment(html, {locationInfo: true})
}

// traverse ast dom node and convert format
function traverse (node) {
  console.log(node)
  let newNode = {
    location: node.__location,
    childNodes: []
  }
  if (node.content && node.content.childNodes) {
    node.content.childNodes.forEach(node => {
      newNode.childNodes.push(traverse(node))
    })
  }
  return newNode
}

// public api
function getTree (html) {
  return traverse(ast.childNodes[0])
}

module.exports = {
  parse,
  getTree
}
