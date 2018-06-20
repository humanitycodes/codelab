import boom from 'boom'
import readAllCoursesForStudentId from '../../../db/course/read-all-for-student-id'
import readAllCoursesForInstructorId from '../../../db/course/read-all-for-instructor-id'
import unionBy from 'lodash/unionBy'

export default {
  method: 'GET',
  path: '/courses',
  handler: function* (request, h) {
    const authUser = request.auth.credentials.user
    try {
      // Collect all courses a user is associated with (student or instructor)
      const courseRecords = yield [
        readAllCoursesForStudentId(authUser.userId),
        readAllCoursesForInstructorId(authUser.userId)
      ]
      // Remove duplicates using courseId as unique identifier
      return unionBy(courseRecords, 'courseId')
    } catch (error) {
      console.error(`Unable to get courses for user ${authUser.userId} (${authUser.fullName}). Reason:`, error)
      return boom.wrap(error)
    }
  }
}
