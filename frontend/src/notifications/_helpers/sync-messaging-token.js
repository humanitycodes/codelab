import messaging from '../messaging'
import store from '@state/store'

export default () => {
  return messaging.getToken()
    .then(messagingToken => {
      if (messagingToken) {
        // todo: sendTokenToServer(messagingToken)
        store.state.currentUser.messagingToken = messagingToken
      } else {
        // todo: sendTokenToServer(null)
        store.state.currentUser.messagingToken = null
        throw new Error(
          'Unable to retrieve a messaging token. ' +
          'This usually happens because permission to allow push ' +
          'notifications must be requested.'
        )
      }
    })
}
