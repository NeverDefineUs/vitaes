# fast-write-atomic

[![Build
Status](https://travis-ci.com/mcollina/fast-write-atomic.svg?branch=master)](https://travis-ci.com/mcollina/fast-write-atomic)

Fast way to write a file atomically, for Node.js

Status: *experimental*

## Install

```
npm i fast-write-atomic
```

## Example

```js
const writeFile = require('fast-write-atomic')

const data = Buffer.from('hello world')

writeFile('./hello', data, function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('file written')
})
```

## Benchmarks

Those benchmarks writes a 1 MB file a thousand times:

```
benchWriteFileAtomic*1000: 9830.501ms
benchFastWriteAtomic*1000: 8848.916ms
benchWriteFileAtomic*1000: 9944.722ms
benchFastWriteAtomic*1000: 8997.108ms
```

## License

MIT

