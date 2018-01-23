const reload = require('cluster-reload')
const { FSWatcher } = require('chokidar')
const cfork = require('cfork')
const debug = require('debug')('reload')
const tildify = require('tildify')
const { info, warning } = require('./utils')

let reloading = false

const run = argv => {
  debug(argv)
  const watcher = new FSWatcher({
    useFsEvents: process.env.NODE_ENV !== 'test',
    ignored: '**/node_modules'
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
    const cluster = cfork({
      exec: argv.exec,
      count: argv.cluster,
      refork: false
    })
    info('cluster start')
    cluster.on('unexpectedExit', (worker, code) => {
      console.log(warning(`worker ${worker.id} exit with code ${code}.`))
    })
  })

  process.on('SIGINT', () => {
    console.log()
    info('Quiting...')
    watcher.close()
    process.exit(0)
  })
}

module.exports = run
