import User from './index'

export default (userId, options) => User.findByPk(userId, options)
