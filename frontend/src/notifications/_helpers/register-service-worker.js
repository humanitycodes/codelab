import messaging from '../messaging'

let usingServiceWorker = false

export default () => {
  if (usingServiceWorker) return

  return navigator.serviceWorker.register('./service-worker.js')
    .then(registration => {
      messaging.useServiceWorker(registration)
      usingServiceWorker = true
    })
}
