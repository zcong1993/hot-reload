const cluster = require('cluster')
const debug = require('debug')('manager')

const manager = ({
  exec,
  args = [],
  nums,
  onExit = () => {},
  onDisconnect = () => {}
} = {}) => {
  debug('init')
  cluster.setupMaster({
    exec,
    args
  })

  for (let i = 0; i < nums; i++) {
    debug(`fork ${i}`)
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    debug('emit exit')
    let suicide = false
    if (worker.exitedAfterDisconnect === true) {
      debug('emit suicide')
      suicide = true
    }
    onExit(worker, code, signal, suicide)
    cluster.emit('unexpectedExit', worker, code, signal)
  })
  cluster.on('disconnect', worker => {
    debug('emit disconnect')
    let suicide = false
    if (worker.exitedAfterDisconnect === true) {
      debug('emit suicide')
      suicide = true
    }
    onDisconnect(worker, suicide)
  })
}

module.exports = manager

