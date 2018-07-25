/* eslint-disable import/first */
// Polyfill features that are not yet natively supported in node
if (!global._babelPolyfill) require('babel-polyfill')

import WEB_CONCURRENCY from '../env/web-concurrency'
import throng from 'throng'
import startWorker from './start-worker'

throng({
  workers: WEB_CONCURRENCY,
  lifetime: Infinity,
  start: startWorker
})
