import UserMessagingToken from './index'

export default (userId, options) => UserMessagingToken.findAll({
  ...options,
  where: {
    userId
  }
})
