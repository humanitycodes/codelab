import messaging from './messaging'
import userAllowsMessaging from './messaging-allowed-by-user'
import firebaseVapidPublicKey from '@env/firebase-vapid-public-key'
import registerServiceWorker from './_helpers/register-service-worker'
import requestPermission from './_helpers/request-permission'
import syncMessagingToken from './_helpers/sync-messaging-token'
import handleTokenRefresh from './_helpers/handle-token-refresh'
import handleMessages from './_helpers/handle-messages'
import handleWakeupNotificationSync from './_helpers/handle-wakeup-notification-sync'

let usingPublicVapidKey = false

export default ({ requestMessagingToken = false } = {}) => {
  // Do not initialize messaging if:
  //  1. Messaging is not available
  //  2. The user has not allowed messaging and
  //     this function shouldn't request permission
  if (
    !messaging ||
    (
      !userAllowsMessaging() &&
      !requestMessagingToken
    )
  ) {
    return Promise.resolve()
  }

  if (!usingPublicVapidKey) {
    messaging.usePublicVapidKey(firebaseVapidPublicKey)
    usingPublicVapidKey = true
  }

  return Promise.resolve()
    .then(() => registerServiceWorker())
    .then(() => requestPermission())
    .then(() => syncMessagingToken())
    .then(() => handleTokenRefresh())
    .then(() => handleMessages())
    .then(() => handleWakeupNotificationSync())
}
