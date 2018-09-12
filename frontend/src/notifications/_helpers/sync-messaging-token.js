import messaging from '../messaging'
import store from '@state/store'

export default () => messaging.getToken()
  .then(messagingToken =>
    store.dispatch('assignMessagingToken', { messagingToken })
    .then(() => {
      if (!messagingToken) {
        throw new Error(
          'Unable to assign a messaging token. ' +
          'This usually happens because permission to allow push ' +
          'notifications must be requested.'
        )
      }
    })
  )
