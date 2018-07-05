import ProjectCompletion from './index'

export default (studentUserId, options) => ProjectCompletion.findAll({
  ...options,
  where: {
    studentUserId
  }
})
