#!/usr/bin/env node

/**
 * Example control from remote caller
 */
'use strict'

const co = require('co')
const assert = require('assert')
const sugoCaller = require('sugo-caller')

co(function * () {
  let caller = sugoCaller('http://my-sugo-cloud.example.com/callers', {})
  let actor = caller.connect('my-actor-01')

  // Access to the module
  let shell = actor.shell()

  // Send ping
  let pong = yield shell.ping()
  assert.ok(pong)

  // Spawn command
  {
    const out = (chunk) => process.stdout.write(chunk)
    const err = (chunk) => process.stderr.write(chunk)

    shell.on('stdout', out)
    shell.on('stderr', err)

    shell.spawn('tail', [ '-f', '/var/log/app.log' ])
    yield new Promise((resolve) => setTimeout(resolve, 3000))

    shell.off('stdout', out)
    shell.off('stderr', err)
  }

  // Execute a command
  {
    let ls = yield shell.exec('ls -la ~') // yield to wait result
    console.log(ls)
  }
}).catch((err) => console.error(err))
