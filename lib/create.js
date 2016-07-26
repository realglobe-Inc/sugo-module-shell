/**
 * Create a module instance
 * @function create
 * @returns {Shell}
 */
'use strict'

const Shell = require('./shell')

/** @lends create */
function create (...args) {
  return new Shell(...args)
}

module.exports = create
