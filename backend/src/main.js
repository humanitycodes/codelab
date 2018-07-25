/* eslint-disable import/first */
// Polyfill features that are not yet natively supported in node
if (!global._babelPolyfill) require('babel-polyfill')

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
