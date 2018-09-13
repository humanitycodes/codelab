import sequelize from 'db/sequelize'
import readProjectCompletionRecordForFullRepoName from '../read-project-completion-record-for-full-repo-name'
import readCourseRecordById from 'db/course/read-by-id'
import updateProjectCompletionRecord from 'db/project-completion/update'
import broadcastProjectCompletionUpdated from 'notifications/project-completions/broadcast-updated'
import readAllUserRecordsWithProjectCompletionAccess from 'db/user/read-all-with-project-completion-access'

export default async issueCommentEvent => {
  if (!['created', 'edited'].includes(issueCommentEvent.action)) return

  let transaction
  try {
    transaction = await sequelize.transaction()

    const projectCompletionRecord =
      await readProjectCompletionRecordForFullRepoName(
        issueCommentEvent.repository.full_name, { transaction }
      )

    // If project is already approved, do nothing
    if (projectCompletionRecord.approved) {
      await transaction.commit()
      return
    }

    // Is this an instructor comment?
    const courseRecord = await readCourseRecordById(
      projectCompletionRecord.courseId, { transaction }
    )
    const instructors = await courseRecord.getInstructors({ transaction })
    const commenterLogin = issueCommentEvent.comment.user.login
    const isInstructorComment = instructors.some(
      instructor => instructor.githubLogin === commenterLogin
    )

    // Determine the comment timestamp
    const issueCommentedAt = (issueCommentEvent.comment.updated_at
      ? new Date(issueCommentEvent.comment.updated_at)
      : new Date(issueCommentEvent.comment.created_at)
    ).getTime()

    // Does the comment contain an approval (:shipit:)?
    const isApproved = issueCommentEvent.comment.body.search(':shipit:') !== -1

    // If the instructor approved it, make it so
    if (isInstructorComment && isApproved) {
      projectCompletionRecord.approved = true
      projectCompletionRecord.approvedAt = issueCommentedAt
    }

    // Accurately reflect who was the last commenter on the submission
    if (issueCommentEvent.action === 'created') {
      projectCompletionRecord.instructorCommentedLast = isInstructorComment
    }

    // Set the most recent comment timestamp
    if (
      !projectCompletionRecord.lastCommentedAt ||
      projectCompletionRecord.lastCommentedAt < issueCommentedAt
    ) {
      projectCompletionRecord.lastCommentedAt = issueCommentedAt
    }

    await updateProjectCompletionRecord(
      projectCompletionRecord, { transaction }
    )

    await transaction.commit()

    // Notify all affected users of the change
    const recipientUserRecords =
      await readAllUserRecordsWithProjectCompletionAccess(
        projectCompletionRecord.projectCompletionId
      )
    broadcastProjectCompletionUpdated({
      projectCompletionRecord,
      recipientUserRecords
    })
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
