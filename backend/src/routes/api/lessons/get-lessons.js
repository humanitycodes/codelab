import boom from 'boom'
import canReadAllLessons from '../../../helpers/permission/can-read-all-lessons'
import readAllLessons from '../../../db/lesson/read-all'
import translateLessonFromRecord from '../../../translators/lesson/from-record'

export default {
  method: 'GET',
  path: '/lessons',
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    try {
      let lessonRecords = []
      if (canReadAllLessons(authUser)) {
        lessonRecords = await readAllLessons()
      }

      const lessons = lessonRecords.map(
        lessonRecord => translateLessonFromRecord({ authUser, lessonRecord })
      )

      return lessons
    } catch (error) {
      console.error(
        `Unable to get lessons for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.wrap(error)
    }
  }
}
