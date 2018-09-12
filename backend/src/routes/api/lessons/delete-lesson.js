import boom from 'boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import HttpStatus from 'http-status'
import canDeleteLesson from 'helpers/permission/can-delete-lesson'
import readLessonRecordById from 'db/lesson/read-by-id'
import deleteLessonRecord from 'db/lesson/delete'
import broadcastLessonDeleted from 'notifications/lessons/broadcast-deleted'
import readAllUserRecordsWithLessonAccess from 'db/user/read-all-with-lesson-access'

export default {
  method: 'DELETE',
  path: '/lessons/{lessonId}',
  options: {
    validate: {
      params: joi.object({
        lessonId: joi.number().integer().required()
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    const lessonId = request.params.lessonId
    let transaction

    try {
      // Do not allow unauthorized users to know the lesson exists
      if (!canDeleteLesson(authUser)) {
        return boom.notFound()
      }

      transaction = await sequelize.transaction()
      const lessonRecord = await readLessonRecordById(lessonId, { transaction })

      if (!lessonRecord) {
        throw boom.notFound()
      }

      // Capture data affected by this change to broadcast later
      const recipientUserRecords =
        await readAllUserRecordsWithLessonAccess(lessonRecord.lessonId)
      const deletedLesson = lessonRecord.get()

      await deleteLessonRecord(lessonRecord, { transaction })
      await transaction.commit()

      // Notify all affected users of the change
      broadcastLessonDeleted({
        lessonRecord: {
          courseId: deletedLesson.lessonId,
          version: deletedLesson.version
        },
        recipientUserRecords
      })

      return h.response().code(HttpStatus.NO_CONTENT)
    } catch (error) {
      console.error(
        `Unable to delete lesson ${lessonId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
