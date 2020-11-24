export default () => {
  try {
    return (
      !/headless/i.test(navigator.userAgent) &&
      ServiceWorkerRegistration &&
      Object.prototype.hasOwnProperty.call(ServiceWorkerRegistration.prototype, 'showNotification')
    )
  } catch (ignore) {
    return false
  }
}
