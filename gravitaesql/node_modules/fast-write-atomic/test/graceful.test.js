'use strict'

// Make sure to read the caveat below.
const realFs = require('fs')
const gracefulFs = require('graceful-fs')
gracefulFs.gracefulify(realFs)

require('./bare.test.js')
