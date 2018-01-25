const cluster = require('cluster')
const reload = require('cluster-reload')
const { FSWatcher } = require('chokidar')
const debug = require('debug')('reload')
const tildify = require('tildify')
const manager = require('./manager')
const { info, warning, logErr } = require('./utils')

let reloading = false

const run = argv => {
  debug(argv)
  const watcher = new FSWatcher({
    useFsEvents: process.env.NODE_ENV !== 'test',
    ignored: ['**/node_modules/**', '**/.git/**'].concat(argv.ignored)
  })
    .add(argv.context)

  watcher.on('change', file => {
    if (reloading) {
      warning('reloading, try again later...')
      return
    }
    reloading = true
    info(`${tildify(file)} changed, reloading...`)
    reload(argv.cluster)
    reloading = false
  })

  watcher.on('ready', () => {
    info('watcher ready')
    manager({
      exec: argv.exec,
      args: argv.args,
      nums: argv.cluster,
      onExit: (worker, _, signal, suicide) => {
        const log = suicide ? warning : logErr
        log(`worker ${worker.id} exit with signal ${signal}.`)
      }
    })
    info('cluster start')
    cluster.on('fork', worker => {
      info(`work ${worker.id} start`)
    })
  })

  process.on('SIGINT', () => {
    console.log()
    info('Quiting...')
    watcher.close()
    process.exit(0)
  })
}

const stop = () => {
  process.emit('SIGINT')
}

module.exports = {
  run,
  stop
}
