export default {
  push: require('./events/push').default
}
/*
export default {
  async issues (issuesEvent) {
    if (issuesEvent.action !== 'opened') return

    const projectMeta = await findProjectCompletionFromRepoName(issuesEvent.repository.full_name)

    // Find the assigned instructor
    let assignedInstructor = null
    const instructors = await readInstructorsByCourseKey(projectMeta.courseKey)
    Object.keys(instructors).forEach(instructorUid => {
      const instructor = instructors[instructorUid]
      if (!instructor.github) return
      const instructorMentionRegex = new RegExp(`@${instructor.github.login}\\b`)
      if (issuesEvent.issue.body.search(instructorMentionRegex) !== -1) {
        assignedInstructor = instructorUid
      }
    })

    // An instructor may not be found if the student did not @mention one
    if (!assignedInstructor) {
      const availableInstructors = Object.keys(instructors)
      const random = Math.floor(Math.random() * availableInstructors.length)
      assignedInstructor = availableInstructors[random]
    }

    // Set submission to awaiting approval
    let projectCompletion = projectMeta.projectCompletion
    projectCompletion.submission = projectCompletion.submission || {}
    projectCompletion.submission.isApproved = false
    projectCompletion.submission.instructorCommentedLast = false
    projectCompletion.submission.assignedInstructor = assignedInstructor
    if (!projectCompletion.submission.firstSubmittedAt) {
      projectCompletion.submission.firstSubmittedAt = new Date(issuesEvent.issue.created_at).getTime()
    }

    await updateProjectCompletion({
      courseKey: projectMeta.courseKey,
      projectCompletionKey: projectMeta.projectCompletionKey
    }, projectCompletion)
  },

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
