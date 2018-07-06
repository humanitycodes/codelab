import boom from 'boom'
import joi from 'joi'
import sequelize from '../../../db/sequelize'
import createProjectCompletionRecord from '../../../db/project-completion/create'
import readCourseRecordById from '../../../db/course/read-by-id'
import readLessonRecordById from '../../../db/lesson/read-by-id'
import readProjectCompletionRecordByCourseLessonStudentIds from '../../../db/project-completion/read-by-course-lesson-student-ids'
import translateProjectCompletionFromRecord from '../../../translators/project-completion/from-record'
import getOrCreateGitHubRepository from '../../../services/github/get-or-create-repository'
import assignGitHubCollaborators from '../../../services/github/assign-collaborators'
import createGitHubWebhooks from '../../../services/github/create-webhooks'

export default {
  method: 'POST',
  path: '/project-completions',
  options: {
    validate: {
      payload: joi.object({
        courseId: joi.number().integer().required(),
        lessonId: joi.number().integer().required()
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    const { courseId, lessonId } = request.payload
    const studentUserId = authUser.userId
    let transaction

    try {
      // Make sure the user has connected their GitHub account
      if (!authUser.githubToken) {
        throw boom.unauthorized('projectCompletion.create.githubToken.missing')
      }

      transaction = await sequelize.transaction()

      // Make sure the course and lesson exists
      const [
        courseRecord,
        lessonRecord,
        existingProjectCompletionRecord
      ] = await [
        readCourseRecordById(courseId, { transaction }),
        readLessonRecordById(lessonId, { transaction }),
        readProjectCompletionRecordByCourseLessonStudentIds(
          { courseId, lessonId, studentUserId }, { transaction }
        )
      ]

      if (!courseRecord) {
        throw boom.badData('projectCompletion.create.course.missing')
      } else if (!lessonRecord) {
        throw boom.badData('projectCompletion.create.lesson.missing')
      } else if (existingProjectCompletionRecord) {
        throw boom.badData('projectCompletion.create.projectCompletion.exists')
      }

      // Ensure the GitHub repository exists and is setup properly
      const courseKey = courseRecord.courseKey
      const repo = `${courseKey}-${lessonRecord.lessonKey}`
      const owner = authUser.githubLogin
      const repository = await getOrCreateGitHubRepository(
        authUser.githubToken, { owner, repo }
      )
      await assignGitHubCollaborators(
        authUser.githubToken, { courseKey, owner, repo }
      )
      await createGitHubWebhooks(authUser.githubToken, { owner, repo })

      // Create the new project completion
      const newProjectCompletion = {
        courseId,
        lessonId,
        studentUserId,
        repositoryCreatedAt: new Date(repository.created_at).getTime()
      }
      const projectCompletionRecord = await createProjectCompletionRecord(
        newProjectCompletion, { transaction }
      )

      // Send the newly created project completion to the client
      const projectCompletion = translateProjectCompletionFromRecord({
        projectCompletionRecord
      })
      await transaction.commit()

      return projectCompletion
    } catch (error) {
      console.error(
        `Unable to create project completion`,
        `for course ${courseId}, lesson ${lessonId},`,
        `and user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
