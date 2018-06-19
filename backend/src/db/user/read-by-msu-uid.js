import User from './index'

export default (msuUid, options) => User.findOne({
  where: {
    msuUid
  }
}, options)
