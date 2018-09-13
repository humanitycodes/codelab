import boom from 'boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import HttpStatus from 'http-status'
import canReviewProjects from 'helpers/permission/can-review-projects'
import readProjectCompletionRecordById from 'db/project-completion/read-by-id'
import readCourseRecordById from 'db/course/read-by-id'
import updateProjectCompletionRecord from 'db/project-completion/update'
import broadcastProjectCompletionUpdated from 'notifications/project-completion/broadcast-updated'
import readAllUserRecordsWithProjectCompletionAccess from 'db/user/read-all-with-project-completion-access'

export default {
  method: 'PUT',
  path: '/project-completions/{projectCompletionId}/instructorUserId',
  options: {
    validate: {
      params: joi.object({
        projectCompletionId: joi.number().integer().required()
      }).required(),
      payload: joi.object({
        instructorUserId: joi.number().integer().required()
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    const projectCompletionId = request.params.projectCompletionId
    let transaction

    try {
      // Do not allow unauthorized users to know the project completion exists
      if (!canReviewProjects(authUser)) {
        return boom.notFound()
      }

      transaction = await sequelize.transaction()
      const projectCompletionRecord = await readProjectCompletionRecordById(
        projectCompletionId, { transaction }
      )

      if (!projectCompletionRecord) {
        throw boom.notFound()
      }

      // Make sure the new instructor is associated with the course
      const newInstructorUserId = request.payload.instructorUserId
      const courseRecord = await readCourseRecordById(
        projectCompletionRecord.courseId, { transaction }
      )
      const instructors = await courseRecord.getInstructors({ transaction })
      if (!instructors.some(
        instructor => instructor.userId === newInstructorUserId
      )) {
        throw boom.conflict(
          'projectCompletion.update.instructorUserId.notInCourse'
        )
      }

      // Assign the new instructor
      projectCompletionRecord.instructorUserId = newInstructorUserId

      // Update the project completion and redirect to the latest version
      await updateProjectCompletionRecord(
        projectCompletionRecord, { transaction }
      )
      await transaction.commit()

      // Notify all affected users of the change
      const recipientUserRecords =
        await readAllUserRecordsWithProjectCompletionAccess(
          projectCompletionRecord.projectCompletionId
        )
      broadcastProjectCompletionUpdated({
        projectCompletionRecord,
        recipientUserRecords
      })

      return h.response().code(HttpStatus.NO_CONTENT)
    } catch (error) {
      console.error(
        'Unable to update instructor',
        `on project completion ${projectCompletionId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
