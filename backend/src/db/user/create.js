import User from './index'

export default (user, options) => {
  user.email = user.email.trim().toLowerCase()
  return User.create(user, options)
}
