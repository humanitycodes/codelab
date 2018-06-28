import User from '../user'
import Lesson from '../lesson'

export default (courseRecord, options) => courseRecord.reload({
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
