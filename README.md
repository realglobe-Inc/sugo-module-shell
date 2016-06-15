sugo-interface-shell
==========

<!---
This file is generated by ape-tmpl. Do not update manually.
--->

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_com_shield_url]][bd_travis_com_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]
[![JS Standard][bd_standard_shield_url]][bd_standard_url]

[bd_repo_url]: https://github.com/realglobe-Inc/sugo-interface-shell
[bd_travis_url]: http://travis-ci.org/realglobe-Inc/sugo-interface-shell
[bd_travis_shield_url]: http://img.shields.io/travis/realglobe-Inc/sugo-interface-shell.svg?style=flat
[bd_travis_com_url]: http://travis-ci.com/realglobe-Inc/sugo-interface-shell
[bd_travis_com_shield_url]: https://api.travis-ci.com/realglobe-Inc/sugo-interface-shell.svg?token=aeFzCpBZebyaRijpCFmm
[bd_license_url]: https://github.com/realglobe-Inc/sugo-interface-shell/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/realglobe-Inc/sugo-interface-shell
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/realglobe-Inc/sugo-interface-shell.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/realglobe-Inc/sugo-interface-shell.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/realglobe-Inc/sugo-interface-shell
[bd_gemnasium_shield_url]: https://gemnasium.com/realglobe-Inc/sugo-interface-shell.svg
[bd_npm_url]: http://www.npmjs.org/package/sugo-interface-shell
[bd_npm_shield_url]: http://img.shields.io/npm/v/sugo-interface-shell.svg?style=flat
[bd_standard_url]: http://standardjs.com/
[bd_standard_shield_url]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

Shell interface of SUGOS

<!-- Description End -->


<!-- Overview Start -->
<a name="overview"></a>



<!-- Overview End -->


<!-- Sections Start -->
<a name="sections"></a>

<!-- Section from "doc/guides/01.Installation.md.hbs" Start -->

<a name="section-doc-guides-01-installation-md"></a>
Installation
-----

```bash
$ npm install sugo-interface-shell --save
```


<!-- Section from "doc/guides/01.Installation.md.hbs" End -->

<!-- Section from "doc/guides/02.Usage.md.hbs" Start -->

<a name="section-doc-guides-02-usage-md"></a>
Usage
---------

Register interface to SUGO-Spot

```javascript
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

```

Then, call the interface from remote url.

```javascript
#!/usr/bin/env node

/**
 * Example control from remote terminal
 */
'use strict'

const co = require('co')
const assert = require('assert')
const sugoTerminal = require('sugo-terminal')

co(function * () {
  let terminal = sugoTerminal('http://my-sugo-cloud.example.com/terminals', {})
  let spot = terminal.connect('my-spot-01')

  // Access to the interface
  let shell = spot.shell()

  // Send ping
  let pong = yield shell.ping()
  assert.ok(pong)

  // Spawn command
  {
    const out = (chunk) => process.stdout.write(chunk)
    const err = (chunk) => process.stderr.write(chunk)

    let tail = shell.spawn('tail', [ '-f', '/var/log/app.log' ])

    tail.on('stdout', out)
    tail.on('stderr', err)

    yield new Promise((resolve) => setTimeout(resolve, 3000))

    tail.off('stdout', out)
    tail.off('stderr', err)
  }

  // Execute a command
  {
    let ls = yield shell.exec('ls -la ~') // yield to wait result
    console.log(ls)
  }
}).catch((err) => console.error(err))

```

<!-- Section from "doc/guides/02.Usage.md.hbs" End -->

<!-- Section from "doc/guides/03.Methods.md.hbs" Start -->

<a name="section-doc-guides-03-methods-md"></a>
Methods
---------

<a name="spawn"></a>
### spawn(command, args, options) -> <code>number</code>

Spawn a command and pipe io to event emitting.

| Param | Type | Description |
| ----- | ---- | ----------- |
| command  | <code>string</code> |  The command to run |
| args  | <code>array</code> |  List of string arguments |
| options  | <code>Object</code> | Optional settings |
<a name="exec"></a>
### exec(command, options) -> <code>object</code>

Execute a command and returns io as object.

| Param | Type | Description |
| ----- | ---- | ----------- |
| command  | <code>string</code> |  The command to run, with space-separated arguments |
| options  | <code>Object</code> | Optional settings |


<!-- Section from "doc/guides/03.Methods.md.hbs" End -->


<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [MIT License](https://github.com/realglobe-Inc/sugo-interface-shell/blob/master/LICENSE).

<!-- LICENSE End -->


<!-- Links Start -->
<a name="links"></a>

Links
------

+ [SUGOS](https://github.com/realglobe-Inc/sugos)

<!-- Links End -->
