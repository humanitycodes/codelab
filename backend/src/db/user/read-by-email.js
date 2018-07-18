import User from './index'

export default (email, options) => User.findOne({
  ...options,
  where: {
    email
  }
})
