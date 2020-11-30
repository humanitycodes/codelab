import dateToTimestamp from '../_helpers/date-to-timestamp'

export default ({ projectCompletionRecord }) => {
  // Whitelist of fields that are available to clients
  const projectCompletion = {
    projectCompletionId: projectCompletionRecord.projectCompletionId,
    courseId: projectCompletionRecord.courseId,
    lessonId: projectCompletionRecord.lessonId,
    studentUserId: projectCompletionRecord.studentUserId,
    instructorUserId: projectCompletionRecord.instructorUserId,
    repositoryCreatedAt: dateToTimestamp(projectCompletionRecord.repositoryCreatedAt),
    approved: projectCompletionRecord.approved,
    committed: projectCompletionRecord.committed,
    instructorCommentedLast: projectCompletionRecord.instructorCommentedLast,
    firstCommittedAt: dateToTimestamp(projectCompletionRecord.firstCommittedAt),
    approvedAt: dateToTimestamp(projectCompletionRecord.approvedAt),
    firstSubmittedAt: dateToTimestamp(projectCompletionRecord.firstSubmittedAt),
    lastCommentedAt: dateToTimestamp(projectCompletionRecord.lastCommentedAt),
    version: projectCompletionRecord.version
  }

  return projectCompletion
}
