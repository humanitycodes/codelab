// NODE_ENV=development yarn build && node dist/scripts/170221-set-missing-approved-dates.js

import firebase from 'firebase-admin'
import { appConfig } from '../firebase-settings'

const app = firebase.initializeApp(appConfig)

const now = Date.now()

firebase.database()
  .ref('courses/fieldGroups/large/student')
  .orderByChild('projectCompletions')
  .once('value')
  .then(allCoursesSnapshot => {
    allCoursesSnapshot.forEach(courseSnapshot => {
      courseSnapshot.forEach(allProjectCompletionsSnapshot => {
        allProjectCompletionsSnapshot.forEach(projectCompletionSnapshot => {
          const projectCompletion = projectCompletionSnapshot.val()
          if (
            projectCompletion.submission &&
            projectCompletion.submission.isApproved &&
            !projectCompletion.submission.approvedAt
          ) {
            console.log(
              'Updating course',
              courseSnapshot.key,
              'and project',
              projectCompletionSnapshot.key
            )
            projectCompletion.submission.approvedAt = now
            projectCompletionSnapshot.ref.set(projectCompletion)
          }
        })
      })
    })
  })
  .then(() => {
    // The most terrifying function name to cleanly disconnect from a service ever
    app.delete()
  })
