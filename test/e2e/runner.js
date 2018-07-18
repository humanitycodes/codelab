// Polyfill features that are not yet natively supported in node
import 'babel-polyfill'

process.env.NODE_ENV = 'testing'

const app = require('../../backend/dist/main')

app.then(server => {
  let opts = process.argv.slice(2)
  if (opts.indexOf('--config') === -1) {
    opts = opts.concat(['--config', 'dist/nightwatch.conf.js'])
  }
  if (opts.indexOf('--env') === -1) {
    opts = opts.concat(['--env', 'chrome'])
  }

  // Spawn custom Nightwatch runner that lets us do cleanup after all tests
  const spawn = require('cross-spawn')
  const runner = spawn(
    './node_modules/.bin/nightwatch', opts, { stdio: 'inherit' }
  )

  const stopServer = async () => {
    if (server) {
      console.log('Testing complete. Stopping server...')
      await server.stop()
    }
  }

  runner.on('exit', async code => {
    await stopServer()
    process.exit(code)
  })

  runner.on('error', async err => {
    await stopServer()
    throw err
  })
})
