import messaging from './messaging'

let messagingInitialized = false

export default () => {
  if (messagingInitialized) return Promise.resolve(messaging)
  messagingInitialized = true

  return messaging.requestPermission()
    .then(() => {
      console.log('Notification permission granted.')
      return messaging
    }).catch(err => {
      console.log('Unable to get permission to notify.', err)
      throw err
    })
}
