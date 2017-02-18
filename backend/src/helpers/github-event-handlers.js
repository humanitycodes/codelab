import boom from 'boom'

import { readUserByGitHubLogin } from '../db/user-repo'
import { readInstructorsByCourseKey } from '../db/instructor-repo'
import {
  readProjectCompletionByPartialKey,
  updateProjectCompletion
} from '../db/project-completion-repo'

// Capture Group 1. GitHub Username: ([^/]+)
// Capture Group 2. Course Key: ([A-Z]+-\d{3}-[A-Z]{2}\d{2}-\d{3})
// Capture Group 3. Lesson Key: ([a-z]+(?:-[a-z]+)*)
// Capture Group 4. Project Key Last 6: (\S{6})
const REPO_REGEX = /^([^/]+)\/([A-Z]+-\d{3}-[A-Z]{2}\d{2}-\d{3})-([a-z]+(?:-[a-z]+)*)-(\S{6})$/

function parseKeysFromRepoName (name) {
  if (!REPO_REGEX.test(name)) return

  const groups = REPO_REGEX.exec(name)
  return {
    username: groups[1],
    courseKey: groups[2],
    lessonKey: groups[3],
    projectKeyPart: groups[4]
  }
}

// repoName => egillespie/MI-654-SS17-654-css-sbvvixzswv-Biv4GT
function* findProjectCompletionFromRepoName (repoName) {
  // Figure out the owner, course, lesson, and project from the repo
  const derivedKeys = parseKeysFromRepoName(repoName)
  if (!derivedKeys) throw boom.badData(`Unable to parse repository name: ${repoName}`)
  const { username, courseKey, lessonKey, projectKeyPart } = derivedKeys

  // Get the internal user ID
  const [userId] = yield readUserByGitHubLogin(username)
  if (!userId) throw boom.badData(`Unable to find user with GitHub login: ${username}`)

  // Find matching project completions
  const projectCompletions = yield readProjectCompletionByPartialKey({
    uid: userId,
    courseKey: courseKey,
    lessonKey: lessonKey,
    projectKeyPart: projectKeyPart
  })

  // Make sure there's exactly 1
  const projectCompletionKeys = Object.keys(projectCompletions)
  if (projectCompletionKeys.length !== 1) {
    throw boom.notFound(`Found ${projectCompletionKeys.length} project completions when expecting 1`)
  }

  return {
    uid: userId,
    username: username,
    courseKey: courseKey,
    lessonKey: lessonKey,
    projectCompletionKey: projectCompletionKeys[0],
    projectCompletion: projectCompletions[projectCompletionKeys[0]]
  }
}

export default {
  push: function* (pushEvent) {
    // Make sure there was at least one commit
    if (!pushEvent.commits.length) return

    const projectMeta = yield findProjectCompletionFromRepoName(pushEvent.repository.full_name)

    // Set committed to true
    if (!projectMeta.projectCompletion.committed) {
      projectMeta.projectCompletion.committed = true
      yield updateProjectCompletion({
        courseKey: projectMeta.courseKey,
        projectCompletionKey: projectMeta.projectCompletionKey
      }, projectMeta.projectCompletion)
    }
  },

  issues: function* (issuesEvent) {
    if (issuesEvent.action !== 'opened') return

    const projectMeta = yield findProjectCompletionFromRepoName(issuesEvent.repository.full_name)

    // Find the assigned instructor
    let assignedInstructor = null
    const instructors = yield readInstructorsByCourseKey(projectMeta.courseKey)
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

    yield updateProjectCompletion({
      courseKey: projectMeta.courseKey,
      projectCompletionKey: projectMeta.projectCompletionKey
    }, projectCompletion)
  },

  issue_comment: function* (issueCommentEvent) {
    if (['created', 'edited'].indexOf(issueCommentEvent.action) === -1) return

    const projectMeta = yield findProjectCompletionFromRepoName(issueCommentEvent.repository.full_name)

    let projectCompletion = projectMeta.projectCompletion
    projectCompletion.submission = projectCompletion.submission || {}

    // If submission is already approved, do nothing
    if (projectCompletion.submission.isApproved) return

    // Is this an instructor comment?
    const instructors = yield readInstructorsByCourseKey(projectMeta.courseKey)
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

    // Does the comment contain an approval (:shipit:)?
    let isApproved = issueCommentEvent.comment.body.search(':shipit:') !== -1

    // If the instructor approved it, make it so
    if (isInstructorComment && isApproved) {
      projectCompletion.submission.isApproved = true
    }

    // Accurately reflect who was the last commenter on the submission
    if (issueCommentEvent.action === 'created') {
      projectCompletion.submission.instructorCommentedLast = isInstructorComment
    }

    // Set the most recent comment timestamp
    const issueCommentedAt = issueCommentEvent.comment.updated_at
      ? new Date(issueCommentEvent.comment.updated_at)
      : new Date(issueCommentEvent.comment.created_at)
    if (
      !projectCompletion.submission.lastCommentedAt ||
      projectCompletion.submission.lastCommentedAt < issueCommentedAt.getTime()
    ) {
      projectCompletion.submission.lastCommentedAt = issueCommentedAt.getTime()
    }

    yield updateProjectCompletion({
      courseKey: projectMeta.courseKey,
      projectCompletionKey: projectMeta.projectCompletionKey
    }, projectCompletion)
  }
}
