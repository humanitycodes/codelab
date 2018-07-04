import Course from './index'
import Lesson from '../lesson'
import User from '../user'
import CourseStudentPending from './student-pending'

export default (courseId, options) => Course.findById(courseId, {
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
