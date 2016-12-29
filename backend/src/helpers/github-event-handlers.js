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
    courseKey: courseKey,
    lessonKey: lessonKey,
    projectCompletionKey: projectCompletionKeys[0],
    projectCompletion: projectCompletions[projectCompletionKeys[0]]
  }
}

export default {
  push: function* (push) {
    // Make sure there was at least one commit
    if (!push.commits.length) return

    const results = yield findProjectCompletionFromRepoName(push.repository.full_name)

    // Set committed to true
    if (!results.projectCompletion.committed) {
      results.projectCompletion.committed = true
      yield updateProjectCompletion({
        courseKey: results.courseKey,
        projectCompletionKey: results.projectCompletionKey
      }, results.projectCompletion)
    }
  },

  issues: function* (issue) {
    if (issue.action !== 'opened') return

    const results = yield findProjectCompletionFromRepoName(issue.repository.full_name)

    // Set submission to awaiting approval
    let projectCompletion = results.projectCompletion
    projectCompletion.submission = projectCompletion.submission || {}
    projectCompletion.submission.isApproved = false
    projectCompletion.submission.instructorCommentedLast = false

    yield updateProjectCompletion({
      courseKey: results.courseKey,
      projectCompletionKey: results.projectCompletionKey
    }, projectCompletion)
  },

  issue_comment: function* (issueComment) {
    if (['created', 'edited'].indexOf(issueComment.action) === -1) return

    const results = yield findProjectCompletionFromRepoName(issueComment.repository.full_name)

    let projectCompletion = results.projectCompletion
    projectCompletion.submission = projectCompletion.submission || {}

    // If submission is already approved, do nothing
    if (projectCompletion.submission.isApproved) return

    // Is this an instructor comment?
    const instructors = yield readInstructorsByCourseKey(results.courseKey)
    const commenterLogin = issueComment.comment.user.login
    let isInstructorComment = false
    Object.values(instructors).forEach(instructor => {
      if (instructor.github && commenterLogin === instructor.github.login) {
        isInstructorComment = true
      }
    })

    // Does the comment contain an approval (:shipit:)?
    let isApproved = issueComment.comment.body.search(':shipit:') !== -1

    // If the instructor approved it, make it so
    if (isInstructorComment && isApproved) {
      projectCompletion.submission.isApproved = true
    }

    // Accurately reflect who was the last commenter on the submission
    if (issueComment.action === 'created') {
      projectCompletion.submission.instructorCommentedLast = isInstructorComment
    }

    yield updateProjectCompletion({
      courseKey: results.courseKey,
      projectCompletionKey: results.projectCompletionKey
    }, projectCompletion)
  }
}
