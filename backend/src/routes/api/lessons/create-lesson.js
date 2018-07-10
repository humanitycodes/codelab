import boom from 'boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import canCreateLesson from '../../../helpers/permission/can-create-lesson'
import createLessonRecord from 'db/lesson/create'
import readLessonRecordByKey from 'db/lesson/read-by-key'
import refreshLessonRecord from 'db/lesson/refresh'
import translateLessonFromRecord from 'translators/lesson/from-record'
import translateLessonFromPayload from 'translators/lesson/from-payload'

export default {
  method: 'POST',
  path: '/lessons',
  options: {
    validate: {
      payload: joi.object({
        lessonKey: joi.string().required()
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    let transaction
    try {
      if (!canCreateLesson(authUser)) {
        return boom.forbidden()
      }

      transaction = await sequelize.transaction()

      // Make sure the lesson key is not already in use
      const existingLessonRecord = await readLessonRecordByKey(
        request.payload.lessonKey, { transaction }
      )
      if (existingLessonRecord) {
        throw boom.badData('lesson.create.lessonKey.exists')
      }

      // Create the new lesson
      const newLesson = translateLessonFromPayload({ payload: request.payload })
      const lessonRecord = await createLessonRecord(newLesson, { transaction })

      // Send the newly created lesson to the client
      await refreshLessonRecord(lessonRecord, { transaction })
      const lesson = translateLessonFromRecord({ lessonRecord })
      await transaction.commit()

      return lesson
    } catch (error) {
      console.error(
        `Unable to create lesson for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
