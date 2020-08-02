# @apexearth/copy

![npm (scoped)](https://img.shields.io/npm/v/@apexearth/copy.svg)
[![Travis Status](https://travis-ci.org/apexearth/copy.svg?branch=master)](https://coveralls.io/github/apexearth/copy?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/apexearth/copy/badge.svg?branch=master)](https://coveralls.io/github/apexearth/copy?branch=master)
![NPM Downloads](https://img.shields.io/npm/dw/@apexearth/copy.svg?style=flat)
[![install size](https://packagephobia.now.sh/badge?p=@apexearth/copy)](https://packagephobia.now.sh/result?p=@apexearth/copy)
![License](https://img.shields.io/npm/l/@apexearth/copy.svg?style=flat)

Copy files via command line or Node.js.

## Why?

- Resume ability via state saving allows you to copy hundreds of thousands of files without having to start over.
- Parallel transfers can increase speed of transferring smaller files over network connections such as Samba.
- Because sometimes you need to copy **a lot of** stuff!

## Installation

### Node.js Usage

    $ npm i @apexearth/copy
    
### Command Line Usage

    $ npm i @apexearth/copy -g
    
## Usage

### Node.js Usage

```javascript
const copy = require('@apexearth/copy')
copy({
    from,                // Source copy path.
    to,                  // Destination copy path.
    recursive,           // Copy recursively.
    overwrite,           // Overwrite existing file
    overwriteMismatches, // Overwrite if size mismatch or from modified date is more recent.
    verbose,             // Verbose output.
    json,                // JSON output. (options: true, "pretty")
    ignoreErrors,        // Continue on errors.
    parallelJobs,        // Number of possible concurrent jobs.
    state,               // Save state for resume ability.
    stateFrequency,      // Save state frequency.
    copyFile,            // Supply your own copyFile function. (from, to, cb)
    readdir,             // Supply your own readdir function. (path, cb)
    stat,                // Supply your own stat function. (path, cb)
})
    .then(() => console.log('done'))
    .catch(err => console.error(err))
```

### Command Line Usage

```
Usage: node-copy [options] <from> <to>

Options:
  -V, --version               output the version number
  -r, --recursive             Copy recursively.
  -o, --overwrite             Overwrite existing.
  --overwrite-mismatches      Overwrite if size mismatch or from modified date is more recent.
  -v, --verbose               Verbose output.
  -j, --json <format>         JSON output. (options: true, pretty)
  -e, --ignore-errors         Ignore errors.
  -p, --parallel-jobs <n>     Number of possible concurrent jobs. (default: 1)
  -s, --state <file>          Save state to file for resume ability.
  --state-frequency <n>       Save state frequency. (In <n> files saved.) (default: 100)
  -a, --archive <state-file>  Attempt to copy as much as possible using options `-mervs <state-file> -p 4` with restart capabilities.
  -h, --help                  output usage information
```
