'use strict'

const { open, write, close, rename, fsync, unlink } = require('fs')
const { join, dirname } = require('path')

var counter = 0

function cleanup (dest, err, cb) {
  unlink(dest, function () {
    cb(err)
  })
}

function closeAndCleanup (fd, dest, err, cb) {
  close(fd, cleanup.bind(null, dest, err, cb))
}

function writeLoop (fd, content, contentLength, offset, cb) {
  write(fd, content, offset, function (err, bytesWritten) {
    if (err) {
      cb(err)
      return
    }

    return (bytesWritten < contentLength - offset)
      ? writeLoop(fd, content, contentLength, offset + bytesWritten, cb)
      : cb(null)
  })
}

function openLoop (dest, cb) {
  open(dest, 'w', function (err, fd) {
    if (err) {
      return (err.code === 'EMFILE')
        ? openLoop(dest, cb)
        : cb(err)
    }

    cb(null, fd)
  })
}

function writeAtomic (path, content, cb) {
  const tmp = join(dirname(path), '.' + process.pid + '.' + counter++)
  openLoop(tmp, function (err, fd) {
    if (err) {
      cb(err)
      return
    }

    const contentLength = Buffer.byteLength(content)
    writeLoop(fd, content, contentLength, 0, function (err) {
      if (err) {
        closeAndCleanup(fd, tmp, err, cb)
        return
      }

      fsync(fd, function (err) {
        if (err) {
          closeAndCleanup(fd, tmp, err, cb)
          return
        }

        close(fd, function (err) {
          if (err) {
            // TODO could we possibly be leaking a file descriptor here?
            cleanup(tmp, err, cb)
            return
          }

          rename(tmp, path, (err) => {
            if (err) {
              cleanup(tmp, err, cb)
              return
            }

            cb(null)
          })
        })
      })
    })

    // clean up after oursevles, this is not needed
    // anymore
    content = null
  })
}

module.exports = writeAtomic
