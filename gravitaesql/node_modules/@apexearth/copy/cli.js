#!/usr/bin/env node

const {version} = require('./package.json')
const program   = require('commander')
const {Copy}    = require('./index')

program
    .name('node-copy')
    .version(version)
    .arguments('<from> <to>')
    .option('-r, --recursive', 'Copy recursively.')
    .option('-o, --overwrite', 'Overwrite existing.')
    .option('-m, --overwrite-mismatches', 'Overwrite if size mismatch or from modified date is more recent.')
    .option('-v, --verbose', 'Verbose output.')
    .option('-j, --json <format>', 'JSON output. (options: true, pretty)')
    .option('-e, --ignore-errors', 'Ignore errors.')
    .option('-p, --parallel-jobs <n>', 'Number of possible concurrent jobs.', 1)
    .option('-s, --state <file>', 'Save state to file for resume ability.')
    .option('--state-frequency <n>', 'Save state frequency. (In <n> files saved.)', 100)
    .option('-a, --archive <file>', 'Attempt to copy as much as possible using options `-mervs <file> -p 4` with restart capabilities.')
    .action((from, to) => {
        program.from           = from
        program.to             = to
        program.parallelJobs   = parseInt(program.parallelJobs)
        program.stateFrequency = parseInt(program.stateFrequency)

        if (program.archive) {
            program.recursive           = true
            program.overwriteMismatches = true
            program.verbose             = true
            program.ignoreErrors        = true
            program.parallelJobs        = 4
            program.state               = program.archive
        }

        const copy = new Copy(program)
        copy.start().catch(err => {
            console.error(err)
            process.exit(1)
        })
    })
    .parse(process.argv)
