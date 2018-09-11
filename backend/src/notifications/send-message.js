import messaging from 'notifications/messaging'
import isString from './_helpers/is-string'

export default async ({ token, data, notification }) => {
  const message = { token }
  if (data) {
    // All values must be strings, convert resource if necessary
    message.data = {
      action: data.action,
      resourceType: data.resourceType,
      resource: isString(data.resource)
        ? data.resource
        : JSON.stringify(data.resource)
    }
  }
  if (notification) {
    message.notification = notification
  }

  // No 'await' here so messages don't hold up requests
  messaging.send(message)
  .catch(error => {
    console.warn('Failed to send message. Reason:', error)
  })
}
