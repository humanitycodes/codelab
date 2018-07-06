import User from './index'

export default (githubLogin, options) => User.findOne({
  ...options,
  where: {
    githubLogin
  }
})
