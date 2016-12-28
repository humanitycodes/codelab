import boom from 'boom'

import { readUserByGitHubLogin } from '../db/user-repo'
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

    // Set submission.hasCommitOnRepository to true
    let projectCompletion = results.projectCompletion
    projectCompletion.submission = projectCompletion.submission || {}

    if (!projectCompletion.submission.hasCommitOnRepository) {
      projectCompletion.submission.hasCommitOnRepository = true
      yield updateProjectCompletion({
        courseKey: results.courseKey,
        projectCompletionKey: results.projectCompletionKey
      }, projectCompletion)
    }
  },

  issues: function* (issue) {
    if (issue.action !== 'opened') return

    console.log('Received issue with payload', issue)
  },

  issue_comment: payload => {
    console.log('Received issue comment with payload', payload)
  }
}
