import Lesson from './index'
import Course from '../course'
import User from '../user'

export default ({ lessonId, userId }, options) => Lesson.findOne({
  ...options,
  where: {
    lessonId
  },
  include: [
    {
      model: Course,
      as: 'courses',
      // Don't eagerly fetch large fields of course
      attributes: ['courseId'],
      // The lesson must have a course with a student matching the provided userId
      required: true,
      include: [
        {
          model: User,
          as: 'students',
          required: true,
          where: {
            userId
          }
        }
      ]
    }
  ]
})
