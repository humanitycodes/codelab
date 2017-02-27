import courseLessonUserProjectCompletion from '../finders/course-lesson-user-project-completion'

export default (course, lesson, user) => {
  const courseLessonUserPrereqsAreAllComplete = require('./course-lesson-user-prereqs-are-all-complete').default
  const completion = courseLessonUserProjectCompletion(course, lesson, user)
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
    status.recommended = courseLessonUserPrereqsAreAllComplete(course, lesson)
  }
  return status
}
