/**
 * @function sugoInterfaceShell
 * @param {Object} config - Configuration
 * @returns {Object} - Interface settings
 */
'use strict'

const { name, version, description } = require('../package.json')
const co = require('co')
const debug = require('debug')('sugo:interface:shell')
const childProcess = require('child_process')

/** @lends sugoInterfaceShell */
function sugoInterfaceShell (config = {}) {
  return {
    /**
     * Ping a message.
     * @param {SugoInterfaceContext} ctx
     * @returns {Promise.<string>} - Pong message.
     */
    ping (ctx) {
      let { params, pipe } = ctx
      return co(function * () {
        return params[ 0 ] || 'pong' // Return result to remote terminal.
      })
    },
    /**
     * Spawn a command.
     * @param {SugoInterfaceContext} ctx
     * @returns {Promise.<number>} - Exit code of the command.
     */
    spawn (ctx) {
      let { params, pipe } = ctx
      return co(function * () {
        let [ command, args, options ] = params
        return yield new Promise((resolve, reject) => {
          let spawned = childProcess.spawn(command, args, options)
          spawned.stdout.on('data', (data) => pipe.emit('stdout', data))
          spawned.stderr.on('data', (data) => pipe.emit('stderr', data))
          pipe.on('stdin', (data) => spawned.stdin.write(data))
          spawned.on('error', (err) => reject(err))
          spawned.on('close', (code) => resolve(code))
        })
      })
    },

    /**
     * Execute a command
     * @param {SugoInterfaceContext} ctx
     * @returns {Promise.<ExecResult>} - Stdout content
     * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
     */
    exec (ctx) {
      let { params, pipe } = ctx
      return co(function * () {
        let [command, options] = params
        return yield new Promise((resolve, reject) => {
          childProcess.exec(command, (err, stdout, stderr) => {
            if (err) {
              reject(err)
            } else {
              resolve(stdout, stderr)
            }
          })
        })
      })
    },

    /**
     * Interface specification
     */
    $spec: {
      name,
      version,
      desc: description,
      methods: {
        spawn: {
          desc: 'Spawn a command.',
          params: [
            { name: 'command', type: 'string', desc: ' The command to run' },
            { name: 'args', type: 'array', desc: ' List of string arguments' },
            { name: 'options', type: 'Object', desc: 'Optional settings' }
          ],
          return: {
            type: 'number',
            desc: 'Exit code'
          }
        },
        exec: {
          desc: 'Execute command',
          params: [
            { name: 'command', type: 'string', desc: ' The command to run, with space-separated arguments' },
            { name: 'options', type: 'Object', desc: 'Optional settings' }
          ],
          return: {
            type: 'object',
            desc: 'Result object which contains stdout and stderr'
          }
        }
      }
    }
  }
}

module.exports = sugoInterfaceShell

/**
 * @typedef {Object} SugoInterfaceContext
 * @property {Array} params - Invoke parameters.
 * @property {EventEmitter} pipe - Pipe to remote terminal.
 */

/**
 * @typedef {Object} ExecResult
 * @property {Buffer} stdout - Standard output
 * @property {Buffer} stderr - Standard error output
 *
 */