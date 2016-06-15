#!/usr/bin/env node

/**
 * Apply the interface into spot
 */
'use strict'

const sugoInterfaceShell = require('sugo-interface-shell')

const sugoSpot = require('sugo-spot')
const co = require('co')

co(function * () {
  let spot = sugoSpot('http://my-sugo-cloud.example.com/spots', {
    key: 'my-spot-01',
    interfaces: {
      // Register the interface on spot as "shell"
      shell: sugoInterfaceShell({})
    }
  })
  yield spot.connect()
}).catch((err) => console.error(err))
