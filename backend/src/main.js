// Babel polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import WEB_CONCURRENCY from '../env/web-concurrency'
import startWorker from './start-worker'

if (WEB_CONCURRENCY > 1) {
  const throng = require('throng')

  throng({
    workers: WEB_CONCURRENCY,
    lifetime: Infinity,
    start: startWorker
  })
} else {
  startWorker()
}
