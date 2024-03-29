// Babel polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

process.env.NODE_ENV = 'testing'

const startWorker = require('../../backend/dist/start-worker').default

startWorker().then(server => {
  let opts = process.argv.slice(2)
  if (opts.indexOf('--config') === -1) {
    opts = opts.concat(['--config', 'dist/nightwatch.conf.js'])
  }
  if (opts.indexOf('--env') === -1) {
    opts = opts.concat(['--env', 'chrome'])
  }

  const stopServer = async () => {
    if (server) {
      console.log('Testing complete. Stopping server...')
      await server.stop()
    }
  }

  return new Promise((resolve, reject) => {
    const spawn = require('cross-spawn')
    const runner = spawn(
      './node_modules/.bin/nightwatch', opts, { stdio: 'inherit' }
    )

    runner.on('exit', async code => {
      await stopServer()
      resolve(code)
    })

    runner.on('error', async error => {
      await stopServer()
      reject(error)
    })
  })
})
.then(process.exit)
.catch(error => {
  console.error('Test runner ending unexpectedly. Reason:', error)
  process.exit(1)
})
