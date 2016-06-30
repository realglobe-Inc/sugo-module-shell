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

  it('Get interface spec.', () => co(function * () {
    let interface_ = sugoInterfaceShell({})
    assert.ok(interface_)

    let { $spec } = interface_
    let specError = sgValidator(sgSchemas.interfaceSpec).validate($spec)
    assert.ok(!specError)
  }))

  it('Take ping-pong', () => co(function * () {
    let interface_ = sugoInterfaceShell({})
    let pong = yield interface_.ping({ params: [] })
    assert.ok(pong)
  }))

  it('Spawn a command', () => co(function * () {
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
        off (ev, handler) {
        },
        emit (ev, data) {
          outs[ ev ] = data
        }
      }
    })
    assert.equal(existCode, 0)
    assert.ok(outs.stdout)
  }))

  it('Exec a command', () => co(function * () {
    let interface_ = sugoInterfaceShell({})
    assert.ok(interface_)

    let result = yield interface_.exec({
      params: [ 'echo | pwd' ]
    })
    assert.ok(result)
  }))

  it('Do assert', () => co(function * () {
    let interface_ = sugoInterfaceShell({})
    let caught
    try {
      yield interface_.assert({})
    } catch (err) {
      caught = err
    }
    assert.ok(!caught)
  }))

  it('Compare methods with spec', () => co(function * () {
    let interface_ = sugoInterfaceShell({})
    let { $spec } = interface_
    let implemented = Object.keys(interface_).filter((name) => !/^[\$_]/.test(name))
    let described = Object.keys($spec.methods).filter((name) => !/^[\$_]/.test(name))
    for (let name of implemented) {
      assert.ok(!!~described.indexOf(name), `${name} method should be described in spec`)
    }
    for (let name of described) {
      assert.ok(!!~implemented.indexOf(name), `${name} method should be implemented`)
    }
  }))
})

/* global describe, before, after, it */
