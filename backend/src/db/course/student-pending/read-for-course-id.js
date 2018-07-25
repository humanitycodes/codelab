import CourseStudentPending from './index'

export default (courseId, options) => CourseStudentPending.findAll({
  ...options,
  where: {
    courseId
  }
})
