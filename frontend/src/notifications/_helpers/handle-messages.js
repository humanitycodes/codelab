import messaging from '../messaging'

export default () => {
  return Promise.resolve(
    messaging.onMessage(payload => {
      console.log('Message received:', payload)
    })
  )
}
