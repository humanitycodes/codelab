// Polyfill features that are not yet natively supported in node
import 'babel-polyfill'

import spawn from 'cross-spawn'
import axios from 'axios'
import nightwatchConfig from './nightwatch.conf'

const frontendUrl = nightwatchConfig.test_settings.default.launch_url

// 1. start the dev server using test config
process.env.NODE_ENV = 'testing'

let servers

function shutdown (result) {
  try {
    // Passing a negative PID to kill will terminate all child processes, not just the parent
    if (servers) process.kill(-servers.pid)
  } catch (e) {
    console.error('Unable to shutdown servers, may need to be killed manually')
  }

  if (result) {
    if (isNaN(result)) {
      console.error('Test runner failed with result:', result)
    }
    process.exit(1)
  } else {
    process.exit(0)
  }
}

function watch (child) {
  child.on('close', shutdown)
  child.on('disconnect', shutdown)
  child.on('error', shutdown)
  child.on('exit', shutdown)
  child.on('uncaughtException', shutdown)
  child.on('unhandledRejection', shutdown)
}

function waitForServers (maxWait) {
  const delay = 500
  let totalWait = -delay

  function checkForServers (resolve, reject) {
    totalWait += delay

    axios.get(frontendUrl).then(response => {
      if (response.status === 200) {
        resolve()
      } else if (totalWait > maxWait) {
        reject(new Error(`Servers did not start in time given (${maxWait})`))
      } else {
        setTimeout(checkForServers, delay, resolve, reject)
      }
    }).catch(error => {
      if (totalWait > maxWait) {
        reject(error)
      } else {
        setTimeout(checkForServers, delay, resolve, reject)
      }
    })
  }

  return new Promise((resolve, reject) => {
    setTimeout(checkForServers, 0, resolve, reject)
  })
}

function startRunner () {
  // 2. run the nightwatch test suite against it
  // to run in additional browsers:
  //    1. add an entry in test/e2e/nightwatch.conf.json under "test_settings"
  //    2. add it to the --env flag below
  // or override the environment flag, for example: `npm run e2e -- --env chrome,firefox`
  // For more information on Nightwatch's config file, see
  // http://nightwatchjs.org/guide#settings-file
  var opts = process.argv.slice(2)
  if (opts.indexOf('--config') === -1) {
    opts = opts.concat(['--config', 'dist/nightwatch.conf.js'])
  }
  if (opts.indexOf('--env') === -1) {
    opts = opts.concat(['--env', 'chrome'])
  }

  var runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' })
  watch(runner)
  watch(process)
}

try {
  servers = spawn('yarn', ['run', 'dev-all'], { cwd: '..', stdio: 'inherit', detached: true })
  watch(servers)
  waitForServers(30000).then(startRunner).catch(shutdown)
} catch (error) {
  shutdown(error)
}
