import messaging from 'notifications/messaging'
import isString from './_helpers/is-string'

export default async ({ token, data, notification }) => {
  const message = { token }
  if (data) {
    message.data = {}
    Object.keys(data).forEach(key => {
      // All data values must be strings
      const value = data[key]
      message.data[key] = isString(value)
        ? value
        : JSON.stringify(value)
    })
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
