import boom from 'boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import HttpStatus from 'http-status'
import canDeleteLesson from 'helpers/permission/can-delete-lesson'
import readLessonRecordById from 'db/lesson/read-by-id'
import deleteLessonRecord from 'db/lesson/delete'

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

      await deleteLessonRecord(lessonRecord, { transaction })
      await transaction.commit()

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
