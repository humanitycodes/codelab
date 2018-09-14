import UserMessagingToken from './index'

export default (messagingToken, options) => UserMessagingToken.destroy({
  ...options,
  where: {
    messagingToken
  }
})
