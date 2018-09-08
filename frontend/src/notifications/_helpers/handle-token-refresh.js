import messaging from '../messaging'
import syncMessagingToken from './sync-messaging-token'

export default () => {
  return Promise.resolve(messaging.onTokenRefresh(syncMessagingToken))
}
