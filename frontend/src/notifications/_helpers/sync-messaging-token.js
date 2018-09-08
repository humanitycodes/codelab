import messaging from '../messaging'
import store from '@state/store'
import updateUserMessagingToken from '@api/users/update-user-messaging-token'

export default () => {
  return messaging.getToken().then(messagingToken => {
    const userId = store.state.users.currentUser.userId
    return updateUserMessagingToken({ userId, messagingToken }).then(() => {
      if (!messagingToken) {
        throw new Error(
          'Unable to retrieve a messaging token. ' +
          'This usually happens because permission to allow push ' +
          'notifications must be requested.'
        )
      }
    })
  })
}
