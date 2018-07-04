import Course from './index'
import User from '../user'
import Lesson from '../lesson'
import CourseStudentPending from './student-pending'

export default (userId, options) => Course.findAll({
  ...options,
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
      where: {
        userId
      },
      // Don't eagerly fetch extra fields of students
      attributes: ['userId']
    },
    {
      model: Lesson,
      as: 'lessons',
      // Don't eagerly fetch large fields of lessons
      attributes: ['lessonId']
    },
    {
      model: CourseStudentPending,
      as: 'pendingStudents'
    }
  ]
})
