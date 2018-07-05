import boom from 'boom'
import unionBy from 'lodash/unionBy'
import canReviewProjects from '../../../helpers/permission/can-review-projects'
import readAllProjectCompletionRecordsForStudentId from '../../../db/project-completion/read-all-for-student-id'
import readAllProjectCompletionRecordsForInstructorId from '../../../db/project-completion/read-all-for-instructor-id'
import translateProjectCompletionFromRecord from '../../../translators/project-completion/from-record'

export default {
  method: 'GET',
  path: '/project-completions',
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    try {
      // Get project completions where the user is an instructor of the course
      let instructorCompletions = []
      if (canReviewProjects(authUser)) {
        const instructorCompletionRecords =
          await readAllProjectCompletionRecordsForInstructorId(authUser.userId)
        instructorCompletions = instructorCompletionRecords.map(
          projectCompletionRecord => translateProjectCompletionFromRecord({
            authUser, projectCompletionRecord
          })
        )
      }

      // Get project completions where the user is the student
      const studentCompletionRecords =
        await readAllProjectCompletionRecordsForStudentId(authUser.userId)
      const studentCompletions = studentCompletionRecords.map(
        projectCompletionRecord => translateProjectCompletionFromRecord({
          authUser, projectCompletionRecord
        })
      )

      // Remove duplicates before returning
      return unionBy(
        instructorCompletions,
        studentCompletions,
        projectCompletion => projectCompletion.projectCompletionId
      )
    } catch (error) {
      console.error(
        `Unable to get project completions`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.wrap(error)
    }
  }
}
