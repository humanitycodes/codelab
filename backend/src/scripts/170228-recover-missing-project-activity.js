// NODE_ENV=development yarn build && node dist/scripts/170228-recover-missing-project-activity.js

// Look at every unapproved project completion and do the following:
// 1. If not committed, look for a commit and set:
//    - firstCommittedAt
//    - committed
// 2. If submitted, look at last comment and set:
//    - submission.lastCommentedAt
//    - submission.instructorCommentedLast

import firebase from 'firebase-admin'
import { appConfig } from '../firebase-settings'
import { getCommits, getIssueComments } from '../helpers/github-client'
import { readUserById } from '../db/user-repo'
import { readInstructorsByCourseKey } from '../db/instructor-repo'

const app = firebase.initializeApp(appConfig)
const db = firebase.database()

const computeRepoName = (courseKey, projectCompletion) => {
  return [
    courseKey,
    projectCompletion.lessonKey,
    projectCompletion.projectKey.slice(-6)
  ].join('-')
}

const fetchStudentGitHubInfo = projectCompletion => {
  const userId = Object.keys(projectCompletion.students)[0]

  return readUserById(userId)
    .then(([uid, user]) => {
      if (user && user.github) {
        return user.github
      } else {
        throw new Error(`GitHub info for student ${userId} is missing.`)
      }
    })
    .catch(error => {
      throw new Error(`Unable to fetch GitHub info for student ${userId}. Reason: ${error}`)
    })
}

// 1. If not committed, look for a commit and set:
//    - firstCommittedAt
//    - committed
const updateCommittedFields = (token, {
  courseKey, githubLogin, projectCompletionKey, projectCompletion
}) => {
  if (projectCompletion.committed) return

  const owner = githubLogin
  const repo = computeRepoName(courseKey, projectCompletion)

  return getCommits(token, { owner, repo })
    .then(commits => {
      if (!commits || !commits.length) return

      const firstCommit = commits.reduce((commit1, commit2) => {
        const committedAt1 = new Date(commit1.commit.author.date).getTime()
        const committedAt2 = new Date(commit2.commit.author.date).getTime()
        return committedAt1 < committedAt2 ? commit1 : commit2
      })

      console.log(
        'Updating committed fields for course',
        courseKey,
        'and project completion',
        projectCompletionKey,
      )

      return db.ref('courses/fieldGroups/large/student')
        .child(courseKey)
        .child('projectCompletions')
        .child(projectCompletionKey)
        .update({
          firstCommittedAt: new Date(firstCommit.commit.author.date).getTime(),
          committed: true
        })
        .then(() => {
          console.log(
            'Updated committed fields for course',
            courseKey,
            'and project completion',
            projectCompletionKey,
          )
        })
    })
    .catch(error => {
      throw new Error(`Unable to update committed fields. Reason: ${error}`)
    })
}

// 2. If submitted, look at last comment and set:
//    - submission.lastCommentedAt
//    - submission.instructorCommentedLast
const updateLastCommentFields = (token, {
  courseKey, githubLogin, projectCompletionKey, projectCompletion
}) => {
  if (!projectCompletion.submission) return

  const owner = githubLogin
  const repo = computeRepoName(courseKey, projectCompletion)

  return getIssueComments(token, { owner, repo, issueNumber: 1 })
    .then(comments => {
      if (!comments || !comments.length) return

      const lastComment = comments.reduce((comment1, comment2) => {
        const commentedAt1 = new Date(comment1.updated_at).getTime()
        const commentedAt2 = new Date(comment2.updated_at).getTime()
        return commentedAt1 > commentedAt2 ? comment1 : comment2
      })

      let commentValues = {
        lastCommentedAt: new Date(lastComment.updated_at).getTime()
      }

      return readInstructorsByCourseKey(courseKey)
        .then(instructorMap => {
          let instructorGitHubLogins = []
          Object.keys(instructorMap).forEach(instructorUid => {
            const instructor = instructorMap[instructorUid]
            if (instructor.github.login !== githubLogin) {
              instructorGitHubLogins.push(instructor.github.login)
            }
          })

          commentValues.instructorCommentedLast =
            instructorGitHubLogins.indexOf[lastComment.user.login] >= 0

          console.log(
            'Updating last commented fields for course',
            courseKey,
            'and project completion',
            projectCompletionKey,
          )

          return db.ref('courses/fieldGroups/large/student')
            .child(courseKey)
            .child('projectCompletions')
            .child(projectCompletionKey)
            .child('submission')
            .update(commentValues)
            .then(() => {
              console.log(
                'Updated last commented fields for course',
                courseKey,
                'and project completion',
                projectCompletionKey,
              )
            })
            .catch(error => {
              throw new Error(`Firebase error: ${error}`)
            })
        })
        .catch(error => {
          throw new Error(`Unable to retrieve instructors: ${error}`)
        })
    })
    .catch(error => {
      throw new Error(`Unable to update last commented fields. Reason: ${error}`)
    })
}

const recoverProjectActivity = (courseKey, projectCompletionKey, projectCompletion) => {
  return fetchStudentGitHubInfo(projectCompletion)
    .then(githubUser => {
      return Promise.all([
        updateCommittedFields(githubUser.token, {
          courseKey: courseKey,
          githubLogin: githubUser.login,
          projectCompletionKey: projectCompletionKey,
          projectCompletion: projectCompletion
        }),
        updateLastCommentFields(githubUser.token, {
          courseKey: courseKey,
          githubLogin: githubUser.login,
          projectCompletionKey: projectCompletionKey,
          projectCompletion: projectCompletion
        })
      ])
    })
    .catch(error => {
      console.error(
        'Unable to recover project activity for course',
        courseKey,
        'and project completion',
        projectCompletionKey,
        'Reason:',
        error.message
      )
    })
}

console.log('Recovering missing project activity...')

db.ref('courses/fieldGroups/large/student')
  .orderByChild('projectCompletions')
  .once('value')
  .then(allCoursesSnapshot => {
    let updates = []
    allCoursesSnapshot.forEach(courseSnapshot => {
      courseSnapshot.forEach(allProjectCompletionsSnapshot => {
        allProjectCompletionsSnapshot.forEach(projectCompletionSnapshot => {
          const projectCompletionKey = projectCompletionSnapshot.key
          const projectCompletion = projectCompletionSnapshot.val()
          const courseKey = courseSnapshot.key

          updates.push(recoverProjectActivity(
            courseKey,
            projectCompletionKey,
            projectCompletion
          ))
        })
      })
    })
    Promise.all(updates).then(() => {
      // The most terrifying function name to cleanly disconnect from a service ever
      app.delete()
      console.log('Done recovering missing project activity!')
    })
  })
  .catch(error => {
    app.delete()
    console.error('Unhandled error encountered:', error)
  })