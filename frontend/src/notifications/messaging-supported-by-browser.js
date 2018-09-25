export default () => {
  try {
    return (
      !/headless/i.test(navigator.userAgent) &&
      ServiceWorkerRegistration &&
      ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification')
    )
  } catch (ignore) {
    return false
  }
}
