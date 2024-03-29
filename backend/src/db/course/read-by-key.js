import Course from './index'
import User from '../user'
import Lesson from '../lesson'
import CourseStudentPending from './student-pending'

export default (courseKey, options) => Course.findOne({
  ...options,
  where: {
    courseKey
  },
  include: [
    {
      model: User,
      as: 'instructors'
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
    },
    {
      model: CourseStudentPending,
      as: 'pendingStudents'
    }
  ]
})
