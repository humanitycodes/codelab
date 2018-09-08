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
  if (!messaging || !store.getters.hasMessagingToken) {
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
