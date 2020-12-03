import UserMessagingToken from './index'

export default (userMessagingTokenId, options) =>
  UserMessagingToken.findByPk(userMessagingTokenId, options)
