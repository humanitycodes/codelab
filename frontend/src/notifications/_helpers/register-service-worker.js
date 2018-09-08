import messaging from '../messaging'

export default () => {
  return navigator.serviceWorker.register('./service-worker.js')
    .then(registration => {
      messaging.useServiceWorker(registration)
    })
}
