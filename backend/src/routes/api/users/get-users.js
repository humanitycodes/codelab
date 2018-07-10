import boom from 'boom'
import unionBy from 'lodash/unionBy'
import canReadAllUsers from 'helpers/permission/can-read-all-users'
import readUserRecordById from 'db/user/read-by-id'
import readAllUserRecords from 'db/user/read-all'
import readCourseRecordsForStudentId from 'db/course/read-all-for-student-id'
import translateUserFromRecord from 'translators/user/from-record'

export default {
  method: 'GET',
  path: '/users',
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    try {
      let userRecords
      if (canReadAllUsers(authUser)) {
        userRecords = await readAllUserRecords()
      } else {
        // Fetch course instructors and the requester's user record
        userRecords = [await readUserRecordById(authUser.userId)]
        const courseRecords = await readCourseRecordsForStudentId(authUser.userId)
        // Fetch the instructors for all enrolled courses
        const courseInstructors = await Promise.all(
          courseRecords.map(async courseRecord => courseRecord.getInstructors())
        )
        courseInstructors.forEach(instructors => {
          // Combine the users, leaving out duplicates
          userRecords = unionBy(
            userRecords,
            instructors,
            userRecord => userRecord.userId
          )
        })
      }

      const users = userRecords.map(userRecord =>
        translateUserFromRecord({ authUser, userRecord })
      )

      return users
    } catch (error) {
      console.error(
        `Unable to get users for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.wrap(error)
    }
  }
}
