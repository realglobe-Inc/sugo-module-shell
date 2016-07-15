/**
 * Shell module of SUGOS
 * @module sugo-module-shell
 */

'use strict'

const sugoModuleShell = require('./sugo_module_shell')

let lib = sugoModuleShell.bind(this)

Object.assign(lib, sugoModuleShell, {
  sugoModuleShell
})

module.exports = lib
