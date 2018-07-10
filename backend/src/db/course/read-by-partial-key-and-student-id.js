import { Op } from 'sequelize'
import Course from './index'
import User from '../user'
import Lesson from '../lesson'
import CourseStudentPending from './student-pending'

export default ({ partialCourseKey, studentUserId }, options) => Course.findOne({
  ...options,
  where: {
    courseKey: {
      [Op.like]: `${partialCourseKey}%`
    }
  },
  order: [
    // Look at most recent courses first
    ['courseId', 'DESC']
  ],
  include: [
    {
      model: User,
      as: 'instructors'
    },
    {
      model: User,
      as: 'students',
      where: {
        userId: studentUserId
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
