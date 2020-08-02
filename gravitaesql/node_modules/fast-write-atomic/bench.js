'use strict'

const bench = require('fastbench')
const { tmpdir } = require('os')
const { join } = require('path')
const writeFileAtomic = require('write-file-atomic')
const fastWriteAtomic = require('.')

const dest = join(tmpdir(), 'dest')
const file = Buffer.allocUnsafe(1024 * 1024) // 1MB

const run = bench([
  function benchWriteFileAtomic (cb) {
    writeFileAtomic(dest, file, cb)
  },
  function benchFastWriteAtomic (cb) {
    fastWriteAtomic(dest, file, cb)
  }
], 1000)

run(run)
