import boom from '@hapi/boom'
import canReadAllCourses from 'helpers/permission/can-read-all-courses'
import readAllCourseRecordsForStudentId from 'db/course/read-all-for-student-id'
import readAllCourseRecords from 'db/course/read-all'
import translateCourseFromRecord from 'translators/course/from-record'

export default {
  method: 'GET',
  path: '/courses',
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    try {
      let courseRecords
      if (canReadAllCourses(authUser)) {
        courseRecords = await readAllCourseRecords()
      } else {
        courseRecords = await readAllCourseRecordsForStudentId(authUser.userId)
      }

      const courses = Promise.all(
        courseRecords.map(async courseRecord =>
          translateCourseFromRecord({ authUser, courseRecord })
        )
      )

      return courses
    } catch (error) {
      console.error(
        'Unable to get courses',
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.boomify(error)
    }
  }
}
