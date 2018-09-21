let clientSupportsNotifications = false

try {
  clientSupportsNotifications =
    !/headless/i.test(navigator.userAgent) &&
    ServiceWorkerRegistration &&
    ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification')
} catch (ignore) {
  clientSupportsNotifications = false
}

export default clientSupportsNotifications
