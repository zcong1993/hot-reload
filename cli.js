#!/usr/bin/env node
const path = require('path')
const os = require('os')
const parseArgs = require('minimist')
const tildify = require('tildify')
const { min, info, logPad, yellow, error } = require('./utils')
const run = require('./')

const argv = parseArgs(process.argv.slice(2))

const normalizeOpts = argv => {
  const copy = argv
  if (argv._.length < 1) {
    logPad(error, 'Must define an entry js file.')
    process.exit(0)
  }
  const short = argv._[0]
  copy.exec = path.resolve(process.cwd(), short)
  copy.cluster = ~~argv.cluster ? min(~~argv.cluster, os.cpus().length) : min(os.cpus().length, 1)
  copy.context = argv.context ? path.resolve(process.cwd(), argv.context) : process.cwd()
  info(`use ${yellow(short)} as entry file.`)
  info(`use ${yellow(copy.cluster)} cluster.`)
  info(`use path ${yellow(tildify(copy.context))} as context.`)
  return copy
}

run(normalizeOpts(argv))
