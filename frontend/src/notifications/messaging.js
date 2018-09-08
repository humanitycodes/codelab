import clientSupportsNotifications from './_helpers/client-supports-notifications'

let messaging = null

if (clientSupportsNotifications) {
  const firebase = require('firebase/app')
  require('firebase/messaging')
  const firebaseClientConfig = require('@env/firebase-client-config').default

  firebase.initializeApp(firebaseClientConfig)
  messaging = firebase.messaging()
}

export default messaging
