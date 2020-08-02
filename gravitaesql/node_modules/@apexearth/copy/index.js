const fs          = require('fs')
const path        = require('path')
const {promisify} = require('util')
const readFile    = promisify(fs.readFile)
const writeFile   = promisify(fs.writeFile)
const mkdir       = promisify(fs.mkdir)
const mkdirp      = require('mkdirp')
const pretty      = require('prettysize')
const sleep       = require('sleep-promise')
const assert      = require('assert')

/**
 * @param {string} from - Source copy path.
 * @param {string} to - Destination copy path.
 * @param {boolean} recursive - Copy recursively.
 * @param {boolean} overwrite - Overwrite existing files.
 * @param {boolean} overwriteMismatches - Overwrite if size mismatch or from modified date is more recent.
 * @param {boolean} verbose - Verbose output.
 * @param {boolean} json - JSON output. (options: true, pretty)
 * @param {boolean} ignoreErrors - Continue on errors.
 * @param {boolean} parallelJobs - Number of possible concurrent jobs.
 * @param {string} state - Save state for resume ability.
 * @param {string} stateFrequency - Save state frequency.
 * @param {string} copyFile - Supply your own copyFile function. (from, to, cb)
 * @param {string} readdir - Supply your own readdir function. (path, cb)
 * @param {string} stat - Supply your own stat function. (path, cb)
 */
class Copy {
    constructor(options = {}) {
        this.from                = path.normalize(options.from)
        this.to                  = path.normalize(options.to)
        this.recursive           = options.recursive || false
        this.overwrite           = options.overwrite || false
        this.overwriteMismatches = options.overwriteMismatches || false
        this.verbose             = options.verbose || false
        this.json                = options.json || false
        this.ignoreErrors        = options.ignoreErrors || false
        this.parallelJobs        = options.parallelJobs || 1
        this.stateFile           = options.state
        this.stateFrequency      = options.stateFrequency || 100
        this.fns                 = {
            stat    : promisify(options.stat || fs.stat),
            readdir : promisify(options.readdir || fs.readdir),
            copyFile: promisify(options.copyFile || fs.copyFile),
        }
        this.stateCatchUp        = 0 // Set true when we need to catch up to our saved state.
        this.state               = {
            wip   : [],
            counts: {
                directories: 0,
                files      : 0,
                copies     : 0,
            },
        }

        this.pending = []
        this.errors  = []

        assert.equal(typeof this.from, 'string', 'from should be a string')
        assert.equal(typeof this.to, 'string', 'to should be a string')
        assert.equal(typeof this.parallelJobs, 'number', 'parallelJobs should be a number')
        assert.equal(typeof this.stateFrequency, 'number', 'stateFrequency should be a number')
        assert.equal(typeof this.fns.stat, 'function', 'stat should be a function')
        assert.equal(typeof this.fns.readdir, 'function', 'readdir should be a function')
        assert.equal(typeof this.fns.copyFile, 'function', 'copyFile should be a function')
    }

    async start() {
        try {
            await this.loadState()
            if ((await this.fns.stat(this.from)).isDirectory()) {
                await mkdirp(this.to)
            } else {
                const basedir = path.dirname(this.to)
                await mkdirp(basedir)
            }
            await this.copy(this.from, this.to)

            // Wait for all jobs to complete.
            while (this.pending.length > 0) {
                await sleep(10)
            }
            await this.processJobErrors()
            await this.saveState()
            if (this.state.wip.length) {
                throw new Error('Incomplete `wip` found. Copy likely incomplete.')
            }
            return this.state
        } catch (err) {
            err.state = this.state
            throw err
        }
    }

    async loadState() {
        if (!this.stateFile) return
        try {
            await this.fns.stat(this.stateFile)
            this.state        = JSON.parse(await readFile(this.stateFile))
            this.stateCatchUp = this.state.wip.length
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err
            }
        }
    }

    async saveState() {
        if (!this.stateFile) return
        await writeFile(this.stateFile, JSON.stringify(this.state, null, 2))
    }

    async processJobErrors() {
        let err = this.errors.shift()
        while (err) {
            this.handleError(err)
            err = this.errors.shift()
        }
    }

    async copy(from, to) {
        let catchingUp = this.stateCatchUp > 0
        if (catchingUp) {
            if (this.state.wip.includes(from)) {
                this.stateCatchUp -= 1 // Found one, decrease our catch up count.
            } else if (!this.state.wip.some(wipFile => wipFile.startsWith(from))) {
                return
            }
        }
        try {
            await this.processJobErrors()
            const fromStat    = await this.fns.stat(from)
            const isDirectory = fromStat.isDirectory()
            if (isDirectory && this.recursive) {
                await this.copyDirectory(from, to)
            } else if (!isDirectory) {
                if (!catchingUp) {
                    this.state.wip.push(from)
                }
                await this.queueAction(() => this.copyFile(from, to, fromStat))
                if (this.state.counts.files % this.stateFrequency === 0) {
                    await this.saveState()
                }
            }
        } catch (err) {
            this.handleError(err)
        }
    }

    async copyDirectory(from, to) {
        try {
            try {
                await this.fns.stat(to)
            } catch (err) {
                if (err.code === 'ENOENT') {
                    await mkdir(to)
                } else {
                    throw err
                }
            }
            const files = await this.fns.readdir(from)
            for (let file of files) {
                await this.copy(path.join(from, file), path.join(to, file))
            }
        } catch (err) {
            this.handleError(err)
        } finally {
            this.state.counts.directories++
        }
    }

    async queueAction(asyncFunction) {
        while (this.pending.length >= this.parallelJobs) {
            await sleep(10)
        }
        const action = async () => {
            try {
                await asyncFunction()
            } finally {
                this.pending.splice(this.pending.indexOf(asyncFunction), 1)
            }
        }
        this.pending.push(action)
        action().catch(err => this.errors.push(err))
    }

    async copyFile(from, to, fromStat) {
        this.logCopyAction(to, 'start')
        try {
            const toStat = await this.fns.stat(to)
            if (this.overwrite) {
                await this.doCopy(from, to, fromStat)
            } else if (this.overwriteMismatches) {
                if (fromStat.size !== toStat.size ||
                    fromStat.mtimeMs > toStat.mtimeMs) {
                    this.logCopyAction(to, 'stats mismatch', {
                        fromStat: {
                            size   : fromStat.size,
                            mtimeMs: fromStat.mtimeMs,
                        },
                        toStat  : {
                            size   : toStat.size,
                            mtimeMs: toStat.mtimeMs,
                        },
                    })
                    await this.doCopy(from, to, fromStat)
                } else {
                    this.logCopyAction(to, 'skipped, stats match')
                }
            } else {
                this.logCopyAction(to, 'skipped')
            }
            this.removeWip(from)
        } catch (err) {
            if (err.code === 'ENOENT') {
                await this.doCopy(from, to, fromStat)
                this.removeWip(from)
            } else {
                throw err
            }
        }
        this.state.counts.files++
    }

    async doCopy(from, to, fromStat) {
        try {
            if (this.verbose || this.json) {
                const start = Date.now()
                await this.fns.copyFile(from, to)
                const speed = fromStat.size / ((Date.now() - start) / 1000)
                this.logCopyAction(to, 'complete', {speed})
            } else {
                await this.fns.copyFile(from, to)
            }
            this.state.counts.copies++
        } catch (err) {
            this.logCopyAction(to, 'error')
            this.handleError(err)
        }
    }

    removeWip(from) {
        let wipIndex = this.state.wip.indexOf(from)
        if (wipIndex >= 0) {
            this.state.wip.splice(wipIndex, 1)
        }
    }

    log(message) {
        if (this.verbose || this.json) {
            if (this.json === 'pretty') {
                console.log(JSON.stringify({message, state: this.state}, null, 2) + '\n') // Double our line endings for some clear delimitation.
            } else if (this.json) {
                console.log(JSON.stringify({message, state: this.state}))
            } else {
                console.log(`Count: ${this.state.counts.directories}d ${this.state.counts.files}f Jobs: ${this.pending.length} ${message}`)
            }
        }
    }

    logCopyAction(file, action, extra) {
        if (this.json) {
            let message = {file, action}
            if (extra) {
                Object.assign(message, extra)
            }
            this.log(message)
        } else {
            let message = `Copying: '${file}' (${action})`
            if (extra && extra.speed !== undefined) {
                message += ` (${pretty(extra.speed)}/s)`
            }
            this.log(message)
        }
    }

    handleError(err) {
        if (this.ignoreErrors) {
            console.error(err)
        } else {
            throw err
        }
    }
}

module.exports      = options => {
    const copy = new Copy(options)
    return copy.start()
}
module.exports.Copy = Copy
