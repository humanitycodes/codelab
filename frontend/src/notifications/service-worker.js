import messaging from './messaging'

if (messaging) {
  messaging.setBackgroundMessageHandler(payload => {
    console.log('payload:', payload)
  })
}
