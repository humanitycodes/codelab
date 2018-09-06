import messaging from './messaging'
import requestPermission from './_helpers/request-permission'
import syncMessagingToken from './_helpers/sync-messaging-token'

export default () => {
  if ('serviceWorker' in navigator) {
    return requestPermission()
      .then(() => syncMessagingToken())
      .then(() => messaging)
  } else {
    throw new Error(
      'Your browser does not support service workers. ' +
      'Notifications will not work without this feature.'
    )
  }
}
