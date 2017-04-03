#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const storeEditor = require('./libs/editors/store')
const fileName = process.argv[2]

// load JS source code
let src = fs.readFileSync(path.join(process.cwd(), fileName), 'utf-8')

storeEditor.parse(src)
let actions = storeEditor.getActionsIndex()
console.log(actions)
