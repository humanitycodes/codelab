import Course from './index'
import User from '../user'
import Lesson from '../lesson'

export default (courseKey, options) => Course.findOne({
  ...options,
  where: {
    courseKey
  },
  include: [
    {
      model: User,
      as: 'instructors',
      // Don't eagerly fetch extra fields of instructors
      attributes: ['userId']
    },
    {
      model: User,
      as: 'students',
      // Don't eagerly fetch extra fields of students
      attributes: ['userId']
    },
    {
      model: Lesson,
      as: 'lessons',
      // Don't eagerly fetch large fields of lessons
      attributes: ['lessonId']
    }
  ]
})
