export default {
  issues: require('./events/issues').default,
  push: require('./events/push').default
}
/*
export default {
  async issue_comment (issueCommentEvent) {
    if (['created', 'edited'].indexOf(issueCommentEvent.action) === -1) return

    const projectMeta = await findProjectCompletionFromRepoName(issueCommentEvent.repository.full_name)

    let projectCompletion = projectMeta.projectCompletion
    projectCompletion.submission = projectCompletion.submission || {}

    // If submission is already approved, do nothing
    if (projectCompletion.submission.isApproved) return

    // Is this an instructor comment?
    const instructors = await readInstructorsByCourseKey(projectMeta.courseKey)
    const commenterLogin = issueCommentEvent.comment.user.login
    let isInstructorComment = false
    Object.values(instructors).forEach(instructor => {
      if (
        commenterLogin !== projectMeta.username &&
        instructor.github &&
        commenterLogin === instructor.github.login
      ) {
        isInstructorComment = true
      }
    })

    // Determine the comment timestamp
    const issueCommentedAt = (issueCommentEvent.comment.updated_at
      ? new Date(issueCommentEvent.comment.updated_at)
      : new Date(issueCommentEvent.comment.created_at)
    ).getTime()

    // Does the comment contain an approval (:shipit:)?
    let isApproved = issueCommentEvent.comment.body.search(':shipit:') !== -1

    // If the instructor approved it, make it so
    if (isInstructorComment && isApproved) {
      projectCompletion.submission.isApproved = true
      projectCompletion.submission.approvedAt = issueCommentedAt
    }

    // Accurately reflect who was the last commenter on the submission
    if (issueCommentEvent.action === 'created') {
      projectCompletion.submission.instructorCommentedLast = isInstructorComment
    }

    // Set the most recent comment timestamp
    if (
      !projectCompletion.submission.lastCommentedAt ||
      projectCompletion.submission.lastCommentedAt < issueCommentedAt
    ) {
      projectCompletion.submission.lastCommentedAt = issueCommentedAt
    }

    await updateProjectCompletion({
      courseKey: projectMeta.courseKey,
      projectCompletionKey: projectMeta.projectCompletionKey
    }, projectCompletion)
  }
}
*/
