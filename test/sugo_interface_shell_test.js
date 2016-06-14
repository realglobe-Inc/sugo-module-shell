/**
 * Test case for sugoInterfaceShell.
 * Runs with mocha.
 */
'use strict'

const sugoInterfaceShell = require('../lib/sugo_interface_shell.js')
const assert = require('assert')
const sgSchemas = require('sg-schemas')
const sgValidator = require('sg-validator')
const co = require('co')

describe('sugo-interface-shell', () => {
  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Sugo demo interface', () => co(function * () {
    let interface_ = sugoInterfaceShell({})
    assert.ok(interface_)

    let { $spec } = interface_
    let specError = sgValidator(sgSchemas.interfaceSpec).validate($spec)
    assert.ok(!specError)
  }))

  it('Spawn the command', () => co(function * () {
    let interface_ = sugoInterfaceShell({})
    assert.ok(interface_)

    let outs = {}
    let existCode = yield interface_.spawn({
      params: [
        'ls',
        [ '-a' ]
      ],
      pipe: {
        on (ev, handler) {
        },
        emit (ev, data) {
          outs[ ev ] = data
        }
      }
    })
    assert.equal(existCode, 0)
    assert.ok(outs.stdout)
  }))
})

/* global describe, before, after, it */
