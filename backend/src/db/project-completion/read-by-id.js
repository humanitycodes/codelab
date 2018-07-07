import ProjectCompletion from './index'

export default (projectCompletionId, options) =>
  ProjectCompletion.findById(projectCompletionId, options)
