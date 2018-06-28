import Course from './index'
import User from '../user'
import Lesson from '../lesson'

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
    },
    {
      model: Lesson,
      as: 'lessons',
      // Don't eagerly fetch large fields of lessons
      attributes: ['lessonId']
    }
  ]
})
