import Lesson from './index'
import Course from '../course'
import User from '../user'
import largeLessonFields from './large-fields'

export default (userId, options) => Lesson.findAll({
  ...options,
  attributes: {
    exclude: largeLessonFields
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
