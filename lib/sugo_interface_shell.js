/**
 * @function sugoInterfaceShell
 * @param {Object} config - Configuration
 * @returns {Object} - Interface settings
 */
'use strict'

const { name, version } = require('../package.json')
const co = require('co')
const debug = require('debug')('sugo:interface:shell')
const childProcess = require('child_process')

/** @lends sugoInterfaceShell */
function sugoInterfaceShell (config = {}) {
  return {
    /**
     * Ping a message.
     * @param {SpotContext} ctx
     * @returns {Promise.<string>} - Pong message.
     */
    ping (ctx) {
      let { params, pipe } = ctx
      debug('Invoke ping with params: ', params)
      return co(function * () {
        return 'pong!' // Return result to remote terminal.
      })
    },
    /**
     * Spawn a command.
     * @param {SpotContext} ctx
     * @returns {Promise.<number>} - Exit code of the command.
     */
    spawn (ctx) {
      let { params, pipe } = ctx
      return co(function * () {
        return yield new Promise((resolve, reject) => {
          let [ cmd, args, options ] = params
          let spawned = childProcess.spawn(cmd, args, options)
          spawned.stdout.on('data', (data) => pipe.emit('stdout', data))
          spawned.stderr.on('data', (data) => pipe.emit('stderr', data))
          pipe.on('stdin', (data) => spawned.stdin.write(data))
          spawned.on('error', (err) => reject(err))
          spawned.on('close', (code) => resolve(code))
        })
      })
    },

    /**
     * Interface specification
     */
    $spec: {
      name,
      version,
      desc: 'Run shell as sub processes',
      methods: {
        spawn: {
          desc: 'Spawn a command',
          params: [
            { name: 'cmd', type: 'string', desc: 'Command to spawn' },
            { name: 'args', type: 'array', desc: 'Command arguments' },
            { name: 'options', type: 'Object', desc: 'Optional settings' }
          ]
        }
      }
    }
  }
}

module.exports = sugoInterfaceShell

/**
 * @typedef {Object} SpotContext
 * @property {Array} params - Invoke parameters.
 * @property {EventEmitter} pipe - Pipe to remote terminal.
 */
