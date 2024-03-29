import Course from './index'
import User from '../user'
import largeCourseFields from './large-fields'

export default (userId, options) => Course.findAll({
  ...options,
  attributes: {
    exclude: largeCourseFields
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
