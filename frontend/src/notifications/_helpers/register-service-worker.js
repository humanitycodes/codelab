import messaging from '../messaging'

export default () => {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        messaging.useServiceWorker(registration)
      })
  } else {
    return Promise.reject(
      new Error(
        'Your browser does not support service workers. ' +
        'Notifications will not work without this feature.'
      )
    )
  }
}
