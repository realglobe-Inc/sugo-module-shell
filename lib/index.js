/**
 * Shell interface of SUGOS
 * @module sugo-interface-shell
 */

'use strict'

const sugoInterfaceShell = require('./sugo_interface_shell')

let lib = sugoInterfaceShell.bind(this)

Object.assign(lib, sugoInterfaceShell, {
  sugoInterfaceShell
})

module.exports = lib
