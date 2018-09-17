import Course from './index'
import User from '../user'

export default ({ courseId, userId }, options) => Course.findOne({
  ...options,
  where: {
    courseId
  },
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
