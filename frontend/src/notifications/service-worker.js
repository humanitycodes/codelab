import messaging from './messaging'

messaging.setBackgroundMessageHandler(payload => {
  console.log('payload:', payload)
})
