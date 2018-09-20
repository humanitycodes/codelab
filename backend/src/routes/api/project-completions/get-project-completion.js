import boom from 'boom'
import joi from 'joi'
import readProjectCompletionRecordById from 'db/project-completion/read-by-id'
import readAllUserRecordsWithProjectCompletionAccess from 'db/user/read-all-with-project-completion-access'
import translateProjectCompletionFromRecord from 'translators/project-completion/from-record'

export default {
  method: 'GET',
  path: '/project-completions/{projectCompletionId}',
  options: {
    validate: {
      params: joi.object({
        projectCompletionId: joi.number().integer().required()
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    const projectCompletionId = request.params.projectCompletionId

    try {
      const projectCompletionRecord =
        await readProjectCompletionRecordById(projectCompletionId)

      if (!projectCompletionRecord) {
        return boom.notFound()
      }

      // The user must be a student or instructor connected to the completion
      const usersWithAccess =
        await readAllUserRecordsWithProjectCompletionAccess(projectCompletionId)

      if (!usersWithAccess.some(user => user.userId === authUser.userId)) {
        return boom.notFound()
      }

      const projectCompletion = translateProjectCompletionFromRecord({
        authUser, projectCompletionRecord
      })
      return projectCompletion
    } catch (error) {
      console.error(
        `Unable to get project completion ${projectCompletionId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.wrap(error)
    }
  }
}
