import firebase from 'firebase-admin'

import { readUserById } from './user-repo'

export async function readInstructorsByCourseKey (courseKey) {
  const db = firebase.database()

  return db.ref('courses/relationships')
    .child(courseKey)
    .child('instructors')
    .once('value')
    .then(instructorsSnapshot => {
      let instructorLookups = []
      if (instructorsSnapshot.val()) {
        Object.keys(instructorsSnapshot.val()).forEach(uid => {
          instructorLookups.push(readUserById(uid))
        })
      }
      return Promise.all(instructorLookups)
    })
    .then(instructorResults => {
      let instructors = {}
      instructorResults.forEach(([uid, user]) => {
        instructors[uid] = user
      })
      return instructors
    })
}
