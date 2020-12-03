import ProjectCompletion from './index'

export default (projectCompletionId, options) =>
  ProjectCompletion.findByPk(projectCompletionId, options)
