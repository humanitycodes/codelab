import User from './index'

export default (msuUid, options) => User.findOne({
  ...options,
  where: {
    msuUid
  }
})
