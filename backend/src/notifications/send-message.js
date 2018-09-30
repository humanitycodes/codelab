import messaging from 'notifications/messaging'
import deleteUnregisteredMessagingToken from './_helpers/delete-unregistered-messaging-token'

export default async message => {
  // No 'await' here so messages don't hold up requests
  console.log('Sending message:', message)
  messaging.send(message)
  .catch(error => {
    const errorInfo = error.errorInfo || {}
    if (errorInfo.code === 'messaging/registration-token-not-registered') {
      deleteUnregisteredMessagingToken(message.token)
    } else {
      console.warn('Failed to send message. Reason:', error)
    }
  })
}
