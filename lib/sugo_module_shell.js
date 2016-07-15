/**
 * @function sugoModuleShell
 * @param {Object} config - Configuration
 * @returns {Object} - Module settings
 */
'use strict'

const { name, version, description } = require('../package.json')
const co = require('co')
const { hasBin } = require('sg-check')
const debug = require('debug')('sugo:module:shell')
const childProcess = require('child_process')

/** @lends sugoModuleShell */
function sugoModuleShell (config = {}) {
  debug('Config: ', config)

  return {
    /**
     * Spawn a command.
     * @param {SugoModuleContext} ctx
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
     * @param {SugoModuleContext} ctx
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
     * Ping a message.
     * @param {SugoModuleContext} ctx
     * @returns {Promise.<string>} - Pong message.
     */
    ping (ctx) {
      let { params, pipe } = ctx
      return co(function * () {
        return params[ 0 ] || 'pong' // Return result to remote caller.
      })
    },

    /**
     * Assert actor system requirements.
     * @param {SugoModuleContext} ctx
     * @throws {Error} - System requirements failed error
     * @returns {Promise.<boolean>} - Asserted state
     */
    assert (ctx) {
      const bins = [ 'node' ] // Required commands
      return co(function * assertAck () {
        for (let bin of bins) {
          let ok = yield hasBin(bin)
          if (!ok) {
            throw new Error(`[${name}] Command not found: ${bin}`)
          }
        }
        return true
      })
    },

    /**
     * Module specification
     */
    $spec: {
      name,
      version,
      desc: description,
      methods: {
        spawn: {
          desc: 'Spawn a command and pipe io to event emitting.',
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
          desc: 'Execute a command and returns io as object.',
          params: [
            { name: 'command', type: 'string', desc: ' The command to run, with space-separated arguments' },
            { name: 'options', type: 'Object', desc: 'Optional settings' }
          ],
          return: {
            type: 'object',
            desc: 'Result object which contains stdout and stderr'
          }
        },

        ping: {
          desc: 'Test the reachability of a module.',
          params: [
            { name: 'pong', type: 'string', desc: 'Pong message to return' }
          ],
          return: {
            type: 'string',
            desc: 'Pong message'
          }
        },

        assert: {
          desc: 'Test if the actor fulfills system requirements',
          params: [],
          throws: [ {
            type: 'Error',
            desc: 'System requirements failed'
          } ],
          return: {
            type: 'boolean',
            desc: 'System is OK'
          }
        }
      },
      events: {
        stdout: { desc: 'Standard out from spawned process.' },
        stderr: { desc: 'Standard error from spawned process.' }
      }
    }
  }
}

module.exports = sugoModuleShell

/**
 * @typedef {Object} SugoModuleContext
 * @property {Array} params - Invoke parameters.
 * @property {EventEmitter} pipe - Pipe to remote caller.
 */

/**
 * @typedef {Object} ExecResult
 * @property {Buffer} stdout - Standard output
 * @property {Buffer} stderr - Standard error output
 */