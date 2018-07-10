import boom from 'boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import HttpStatus from 'http-status'
import readProjectCompletionRecordById from 'db/project-completion/read-by-id'
import deleteProjectCompletionRecord from 'db/project-completion/delete'
import readCourseRecordById from 'db/course/read-by-id'
import readLessonRecordById from 'db/lesson/read-by-id'
import githubRepoName from 'helpers/github/repo-name'
import deleteGitHubRepository from 'services/github/delete-repository'

export default {
  method: 'DELETE',
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
    let transaction

    try {
      // User must be connected to GitHub before attempting to delete a repo
      if (!authUser.githubToken) {
        throw boom.unauthorized('projectCompletion.delete.githubToken.missing')
      }

      transaction = await sequelize.transaction()
      const projectCompletionRecord = await readProjectCompletionRecordById(
        projectCompletionId, { transaction }
      )

      if (!projectCompletionRecord) {
        throw boom.notFound()
      }

      // Only the project owner can delete it, no one else can see it
      if (projectCompletionRecord.studentUserId !== authUser.userId) {
        throw boom.notFound()
      }

      // Remove the project from GitHub
      const [courseRecord, lessonRecord] = await Promise.all([
        readCourseRecordById(projectCompletionRecord.courseId, { transaction }),
        readLessonRecordById(projectCompletionRecord.lessonId, { transaction })
      ])
      const repo = githubRepoName({
        courseKey: courseRecord.courseKey,
        lessonKey: lessonRecord.lessonKey
      })
      const owner = authUser.githubLogin

      try {
        await deleteGitHubRepository(authUser.githubToken, { owner, repo })
      } catch (notfound) {
        console.warn(
          `Unable to delete GitHub repository ${repo}`,
          `owned by user ${owner}.`,
          'Reason:', notfound
        )
      }

      // Remove the project completion from the database
      await deleteProjectCompletionRecord(
        projectCompletionRecord, { transaction }
      )
      await transaction.commit()

      return h.response().code(HttpStatus.NO_CONTENT)
    } catch (error) {
      console.error(
        `Unable to delete project completion ${projectCompletionId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
