import Course from './index'
import User from '../user'

export default (userId, options) => Course.findAll({
  ...options,
  include: [
    {
      model: User,
      as: 'instructors'
    },
    {
      model: User,
      as: 'students',
      where: {
        userId
      }
    }
  ]
})
