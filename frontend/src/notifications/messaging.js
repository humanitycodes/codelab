import browserSupportsMessaging from '@notifications/messaging-supported-by-browser'

let messaging = null

if (browserSupportsMessaging()) {
  const firebase = require('firebase/app')
  require('firebase/messaging')
  const firebaseClientConfig = require('@env/firebase-client-config').default

  firebase.initializeApp(firebaseClientConfig)
  messaging = firebase.messaging()
}

export default messaging
