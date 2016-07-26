/**
 * Test case for Shell.
 * Runs with mocha.
 */
'use strict'

const Shell = require('../lib/shell.js')
const assert = require('assert')
const sgSchemas = require('sg-schemas')
const sgValidator = require('sg-validator')
const co = require('co')

describe('sugo-module-shell', () => {
  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Get module spec.', () => co(function * () {
    let module = new Shell({})
    assert.ok(module)

    let { $spec } = module
    let specError = sgValidator(sgSchemas.moduleSpec).validate($spec)
    assert.ok(!specError)
  }))

  it('Take ping-pong', () => co(function * () {
    let module = new Shell({})
    let pong = yield module.ping()
    assert.ok(pong)
  }))

  it('Spawn a command', () => co(function * () {
    let module = new Shell({})
    Object.assign(module, {
      on (ev, handler) {
      },
      off (ev, handler) {
      },
      emit (ev, data) {
        outs[ ev ] = data
      }
    })
    assert.ok(module)

    let outs = {}
    let existCode = yield module.spawn('ls', [ '-a' ])
    assert.equal(existCode, 0)
    assert.ok(outs.stdout)
  }))

  it('Exec a command', () => co(function * () {
    let module = new Shell({})
    assert.ok(module)

    let result = yield module.exec('echo | pwd')
    assert.ok(result)
  }))

  it('Do assert', () => co(function * () {
    let module = new Shell({})
    let caught
    try {
      yield module.assert({})
    } catch (err) {
      caught = err
    }
    assert.ok(!caught)
  }))

  it('Compare methods with spec', () => co(function * () {
    let module = new Shell({})
    let { $spec } = module
    let implemented = Object.getOwnPropertyNames(Shell.prototype)
      .filter((name) => !/^[\$_]/.test(name))
      .filter((name) => !~[ 'constructor' ].indexOf(name))
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
