import Course from './index'
import User from '../user'

export default (userId, options) => Course.findAll({
  ...options,
  include: [
    {
      model: User,
      as: 'students',
      where: {
        userId
      },
      // Don't eagerly fetch extra fields of students
      attributes: ['userId']
    }
  ]
})
