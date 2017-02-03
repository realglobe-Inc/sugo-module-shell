/**
 * Shell module for SUGOS
 * @module sugo-module-shell
 * @version 4.0.2
 */

'use strict'

const create = require('./create')
const Shell = require('./shell')

let lib = create.bind(this)

Object.assign(lib, Shell, {
  create,
  Shell
})

module.exports = lib
