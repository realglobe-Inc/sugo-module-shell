#!/usr/bin/env node

/**
 * Apply the module into actor
 */
'use strict'

const sugoModuleShell = require('sugo-module-shell')

const sugoActor = require('sugo-actor')
const co = require('co')

co(function * () {
  let actor = sugoActor('http://my-sugo-cloud.example.com/actors', {
    key: 'my-actor-01',
    modules: {
      // Register the module on actor as "shell"
      shell: sugoModuleShell({})
    }
  })
  yield actor.connect()
}).catch((err) => console.error(err))
