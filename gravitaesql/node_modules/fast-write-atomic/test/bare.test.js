'use strict'

const writeAtomic = require('..')
const proxyquire = require('proxyquire')
const { test, tearDown } = require('tap')
const {
  readFile,
  unlink,
  unlinkSync,
  open,
  write,
  close,
  fsync,
  rename
} = require('fs')
const { tmpdir } = require('os')
const { join } = require('path')

const files = []

tearDown(() => {
  for (let dest of files) {
    try {
      unlinkSync(dest)
    } catch (_) {
    }
  }
})

let nextId = 0

function getDest (name) {
  if (!name) {
    name = 'hello' + nextId++
  }
  const dest = join(tmpdir(), name)
  files.push(dest)
  return dest
}

test('write a file', (t) => {
  t.plan(3)

  const dest = getDest()
  const content = Buffer.allocUnsafe(4096) // 4 KB

  writeAtomic(dest, content, (err) => {
    t.error(err)
    readFile(dest, (err, data) => {
      t.error(err)
      t.equal(Buffer.compare(data, content), 0)
    })
  })
})

test('parallel writes', (t) => {
  t.plan(4)

  const dest = getDest()
  const content1 = Buffer.allocUnsafe(4096).fill('AB') // 4 KB
  const content2 = Buffer.allocUnsafe(4096).fill('CD') // 4 KB

  let countdown = 2

  writeAtomic(dest, content1, (err) => {
    t.error(err)
    done()
  })

  writeAtomic(dest, content2, (err) => {
    t.error(err)
    done()
  })

  function done () {
    if (--countdown !== 0) {
      return
    }

    readFile(dest, (err, data) => {
      t.error(err)
      // we expect either content1 or content2 to be there
      t.equal(Buffer.compare(data, content2) === 0 || Buffer.compare(data, content1) === 0, true)
    })
  }
})

test('calls fsync', (t) => {
  t.plan(5)

  const writeAtomic = proxyquire('..', {
    fs: {
      open,
      write,
      close,
      fsync (fd, cb) {
        t.pass('fsync called')
        return fsync(fd, cb)
      },
      rename (source, dest, cb) {
        t.pass('rename called')
        return rename(source, dest, cb)
      }
    }
  })

  const dest = getDest()
  const content = Buffer.allocUnsafe(4096) // 4 KB

  writeAtomic(dest, content, (err) => {
    t.error(err)
    readFile(dest, (err, data) => {
      t.error(err)
      t.equal(Buffer.compare(data, content), 0)
    })
  })
})

test('unlinks if it errors during rename', (t) => {
  t.plan(4)

  let _source
  const writeAtomic = proxyquire('..', {
    fs: {
      open,
      write,
      close,
      unlink (file, cb) {
        t.equal(file, _source)
        return unlink(file, cb)
      },
      rename (source, dest, cb) {
        _source = source
        process.nextTick(cb, new Error('kaboom'))
      }
    }
  })

  const dest = getDest()
  const content = Buffer.allocUnsafe(4096) // 4 KB

  writeAtomic(dest, content, (err) => {
    t.equal(err.message, 'kaboom')
    readFile(dest, (err) => {
      t.equal(err.code, 'ENOENT')
    })
    readFile(_source, (err) => {
      t.equal(err.code, 'ENOENT')
    })
  })
})

test('unlinks if it errors during write', (t) => {
  t.plan(4)

  let _source
  const writeAtomic = proxyquire('..', {
    fs: {
      open (dest, flags, cb) {
        _source = dest
        return open(dest, flags, cb)
      },
      write (fd, content, offset, cb) {
        process.nextTick(cb, new Error('kaboom'))
      },
      close,
      unlink (file, cb) {
        t.equal(file, _source)
        return unlink(file, cb)
      }
    }
  })

  const dest = getDest()
  const content = Buffer.allocUnsafe(4096) // 4 KB

  writeAtomic(dest, content, (err) => {
    t.equal(err.message, 'kaboom')
    readFile(dest, (err) => {
      t.equal(err.code, 'ENOENT')
    })
    readFile(_source, (err) => {
      t.equal(err.code, 'ENOENT')
    })
  })
})

test('unlinks if it errors during fsync', (t) => {
  t.plan(4)

  let _source
  const writeAtomic = proxyquire('..', {
    fs: {
      open (dest, flags, cb) {
        _source = dest
        return open(dest, flags, cb)
      },
      write,
      close,
      fsync (fd, cb) {
        process.nextTick(cb, new Error('kaboom'))
      },
      unlink (file, cb) {
        t.equal(file, _source)
        return unlink(file, cb)
      }
    }
  })

  const dest = getDest()
  const content = Buffer.allocUnsafe(4096) // 4 KB

  writeAtomic(dest, content, (err) => {
    t.equal(err.message, 'kaboom')
    readFile(dest, (err) => {
      t.equal(err.code, 'ENOENT')
    })
    readFile(_source, (err) => {
      t.equal(err.code, 'ENOENT')
    })
  })
})

test('retries if the write was not completed', (t) => {
  t.plan(5)

  let first = true
  const writeAtomic = proxyquire('..', {
    fs: {
      open,
      write (fd, content, offset, cb) {
        t.pass('fs.write')
        if (first) {
          first = false
          write(fd, content, 0, 16, cb)
          return
        }

        write(fd, content, offset, cb)
      },
      close,
      unlink
    }
  })

  const dest = getDest()
  const content = Buffer.allocUnsafe(4096) // 4 KB

  writeAtomic(dest, content, (err) => {
    t.error(err)
    readFile(dest, (err, data) => {
      t.error(err)
      t.equal(Buffer.compare(data, content), 0)
    })
  })
})

test('errors if open errors', (t) => {
  t.plan(3)

  let _source
  const writeAtomic = proxyquire('..', {
    fs: {
      open (dest, flags, cb) {
        _source = dest
        process.nextTick(cb, new Error('kaboom'))
      }
    }
  })

  const dest = getDest()
  const content = Buffer.allocUnsafe(4096) // 4 KB

  writeAtomic(dest, content, (err) => {
    t.equal(err.message, 'kaboom')
    readFile(dest, (err) => {
      t.equal(err.code, 'ENOENT')
    })
    readFile(_source, (err) => {
      t.equal(err.code, 'ENOENT')
    })
  })
})

test('retries on EMFILE', (t) => {
  t.plan(3)

  let first = true
  const writeAtomic = proxyquire('..', {
    fs: {
      open (dest, flags, cb) {
        if (first) {
          first = false
          const err = new Error('kaboom')
          err.code = 'EMFILE'
          process.nextTick(cb, err)
          return
        }

        return open(dest, flags, cb)
      },
      write,
      close,
      unlink
    }
  })

  const dest = getDest()
  const content = Buffer.allocUnsafe(4096) // 4 KB

  writeAtomic(dest, content, (err) => {
    t.error(err)
    readFile(dest, (err, data) => {
      t.error(err)
      t.equal(Buffer.compare(data, content), 0)
    })
  })
})

test('write 2000 files in parallel', (t) => {
  const MAX = 2000
  let total = 0
  t.plan(1)

  for (var i = 0; i < MAX; i++) {
    const dest = getDest()
    const content = Buffer.allocUnsafe(4096) // 4 KB

    writeAtomic(dest, content, (err) => {
      if (err) {
        t.error(err)
        return
      }

      if (++total === MAX) {
        t.pass(`${total} writes completed`)
      }
    })
  }
})

test('multibyte unicode symbols', (t) => {
  t.plan(1)
  const dest = getDest()
  const content = '{"name":"tajné jménoed25519","id":"QmSvTNE2Eo7SxRXjmEaZnE91cNpduKjYFBtd2LYC4Rsoeq"}'
  writeAtomic(dest, content, (err) => {
    t.error(err)
  })
})
