import messaging from './messaging'
import firebaseVapidPublicKey from '@env/firebase-vapid-public-key'
import registerServiceWorker from './_helpers/register-service-worker'
import requestPermission from './_helpers/request-permission'
import syncMessagingToken from './_helpers/sync-messaging-token'
import handleTokenRefresh from './_helpers/handle-token-refresh'
import handleMessages from './_helpers/handle-messages'
import store from '@state/store'

let usingPublicVapidKey = false

export default () => {
  // Do not initialize messaging if:
  //  1. Messaging is not available
  //  2. User has not accepted a messaging token
  if (!messaging || !store.getters.messagingToken) {
    return Promise.resolve()
  }

  if (!usingPublicVapidKey) {
    messaging.usePublicVapidKey(firebaseVapidPublicKey)
    usingPublicVapidKey = true
  }

  return registerServiceWorker()
    .then(() => requestPermission())
    .then(() => syncMessagingToken())
    .then(() => handleTokenRefresh())
    .then(() => handleMessages())
    .then(() => Promise.resolve())
}
