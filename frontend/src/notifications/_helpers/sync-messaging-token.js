import messaging from '../messaging'
import store from '@state/store'

export default () => {
  return messaging.getToken()
    .then(messagingToken => {
      if (messagingToken) {
        // todo: sendTokenToServer(messagingToken)
        const { currentUser } = store.state.users
        const updatedUser = Object.assign({}, currentUser, { messagingToken })
        store.commit('SET_CURRENT_USER', updatedUser)
      } else {
        // todo: sendTokenToServer(null)
        const { currentUser } = store.state.users
        const updatedUser = Object.assign({}, currentUser, { messagingToken: null })
        store.commit('SET_CURRENT_USER', updatedUser)
        throw new Error(
          'Unable to retrieve a messaging token. ' +
          'This usually happens because permission to allow push ' +
          'notifications must be requested.'
        )
      }
    })
}
