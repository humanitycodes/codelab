import User from './index'

export default (userId, options) => User.findById(userId, options)
