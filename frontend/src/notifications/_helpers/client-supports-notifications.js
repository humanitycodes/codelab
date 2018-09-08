let clientSupportsNotifications = false

try {
  clientSupportsNotifications = ServiceWorkerRegistration &&
    ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification')
} catch (ignore) {
  clientSupportsNotifications = false
}

export default clientSupportsNotifications
