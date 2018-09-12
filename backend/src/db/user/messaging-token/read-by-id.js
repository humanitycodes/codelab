import UserMessagingToken from './index'

export default (userMessagingTokenId, options) =>
  UserMessagingToken.findById(userMessagingTokenId, options)
