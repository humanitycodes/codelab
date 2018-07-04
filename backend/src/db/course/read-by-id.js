import Course from './index'
import Lesson from '../lesson'
import User from '../user'

export default (courseId, options) => Course.findById(courseId, {
  ...options,
  include: [
    {
      model: User,
      as: 'instructors'
    },
    {
      model: User,
      as: 'students'
    },
    {
      model: Lesson,
      as: 'lessons',
      // Don't eagerly fetch large fields of lessons
      attributes: ['lessonId']
    }
  ]
})
