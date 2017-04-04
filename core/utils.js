// slice source code fragment
// according to starting / ending index
function getCode (src, start, end) {
  return src.substr(start, end - start)
}

// replace source code fragment
// according to starting / ending index
function replaceByIndex (src, dist, start, end) {
  return src.slice(0, start) + dist + src.slice(end)
}

// convert object literal stirng to JS object
function getObject (literal) {
  /* eslint-disable no-eval */
  return eval(`(function(){return ${literal};})()`)
}

module.exports = {
  getCode,
  replaceByIndex,
  getObject
}
