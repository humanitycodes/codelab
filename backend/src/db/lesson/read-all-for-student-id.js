import Lesson from './index'
import Course from '../course'
import User from '../user'

export default (userId, options) => Lesson.findAll({
  ...options,
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
