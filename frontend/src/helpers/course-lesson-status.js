import getProjectCompletion from './get-project-completion'

export default (course, lesson) => {
  const courseLessonPrereqsComplete = require('./course-lesson-prereqs-complete').default
  const completion = getProjectCompletion(course, lesson)
  const status = {}
  if (completion) {
    status.started = true
    status.committed = completion.committed
    if (completion.submission) {
      status.submitted = true
      if (completion.submission.isApproved) {
        status.approved = true
      } else if (completion.submission.instructorCommentedLast) {
        status.changesRequested = true
      } else {
        status.awaitingFeedback = true
      }
    }
  }
  if (!status.approved) {
    status.recommended = courseLessonPrereqsComplete(course, lesson)
  }
  return status
}
