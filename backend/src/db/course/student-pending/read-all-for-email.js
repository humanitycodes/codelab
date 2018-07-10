import CourseStudentPending from './index'

export default (email, options) => CourseStudentPending.findAll({
  ...options,
  where: {
    email
  }
})
