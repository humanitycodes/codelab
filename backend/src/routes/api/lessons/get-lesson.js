import boom from '@hapi/boom'
import joi from 'joi'
import canReadAllLessons from 'helpers/permission/can-read-all-lessons'
import readLessonRecordById from 'db/lesson/read-by-id'
import readLessonRecordByIdForStudentId from 'db/lesson/read-by-id-for-student-id'
import translateLessonFromRecord from 'translators/lesson/from-record'

export default {
  method: 'GET',
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

    try {
      let lessonRecord
      if (canReadAllLessons(authUser)) {
        lessonRecord = await readLessonRecordById(lessonId)
      } else {
        lessonRecord = await readLessonRecordByIdForStudentId({
          lessonId,
          userId: authUser.userId
        })
      }

      if (!lessonRecord) {
        return boom.notFound()
      }

      const lesson = await translateLessonFromRecord({ authUser, lessonRecord })
      return lesson
    } catch (error) {
      console.error(
        `Unable to get lesson ${lessonId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.boomify(error)
    }
  }
}
