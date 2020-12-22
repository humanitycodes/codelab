import boom from '@hapi/boom'
import canReadAllLessons from 'helpers/permission/can-read-all-lessons'
import readAllLessonRecords from 'db/lesson/read-all'
import readAllLessonRecordsForStudentId from 'db/lesson/read-all-for-student-id'
import translateLessonFromRecord from 'translators/lesson/from-record'

export default {
  method: 'GET',
  path: '/lessons',
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    try {
      let lessonRecords = []
      if (canReadAllLessons(authUser)) {
        lessonRecords = await readAllLessonRecords()
      } else {
        lessonRecords = await readAllLessonRecordsForStudentId(authUser.userId)
      }

      const lessons = await Promise.all(
        lessonRecords.map(async lessonRecord =>
          translateLessonFromRecord({ authUser, lessonRecord })
        )
      )

      return lessons
    } catch (error) {
      console.error(
        'Unable to get lessons',
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.boomify(error)
    }
  }
}
