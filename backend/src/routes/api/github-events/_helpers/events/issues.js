import sequelize from 'db/sequelize'
import readProjectCompletionRecordForFullRepoName from '../read-project-completion-record-for-full-repo-name'
import readCourseRecordById from 'db/course/read-by-id'
import updateProjectCompletionRecord from 'db/project-completion/update'
import randomElement from 'helpers/utils/random-element'

export default async issuesEvent => {
  if (issuesEvent.action !== 'opened') return

  let transaction
  try {
    transaction = await sequelize.transaction()

    const projectCompletionRecord =
      await readProjectCompletionRecordForFullRepoName(
        issuesEvent.repository.full_name, { transaction }
      )

    // Find the assigned instructor or pick a random one
    const courseRecord = await readCourseRecordById(
      projectCompletionRecord.courseId, { transaction }
    )
    const instructors = await courseRecord.getInstructors({ transaction })
    const assignedInstructor = instructors.find(instructor => {
      if (!instructor.githubLogin) return false
      const instructorMentionRegex = new RegExp(`@${instructor.githubLogin}\\b`)
      return issuesEvent.issue.body.search(instructorMentionRegex) !== -1
    }) || randomElement(instructors)

    // Set submission to awaiting approval
    projectCompletionRecord.approved = false
    projectCompletionRecord.instructorCommentedLast = false
    projectCompletionRecord.instructorUserId = assignedInstructor.userId
    if (!projectCompletionRecord.firstSubmittedAt) {
      projectCompletionRecord.firstSubmittedAt =
        new Date(issuesEvent.issue.created_at).getTime()
    }

    // Save the changes to the project completion
    await updateProjectCompletionRecord(
      projectCompletionRecord, { transaction }
    )

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
