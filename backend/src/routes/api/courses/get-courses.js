import boom from 'boom'
import canReadAllCourses from '../../../helpers/permission/can-read-all-courses'
import readAllCoursesForStudentId from '../../../db/course/read-all-for-student-id'
import readAllCourses from '../../../db/course/read-all'
import translateCourseFromRecord from '../../../translators/course/from-record'

export default {
  method: 'GET',
  path: '/courses',
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    try {
      let courseRecords
      if (canReadAllCourses(authUser)) {
        courseRecords = await readAllCourses()
      } else {
        courseRecords = await readAllCoursesForStudentId(authUser.userId)
      }

      const courses = courseRecords.map(courseRecord =>
        translateCourseFromRecord({ authUser, courseRecord })
      )

      return courses
    } catch (error) {
      console.error(
        `Unable to get courses for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.wrap(error)
    }
  }
}
