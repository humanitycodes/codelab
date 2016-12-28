import firebase from 'firebase-admin'

import {
  readById as readUserById
} from './user-repo'

export async function readInstructorsByCourseKey (courseKey) {
  const db = firebase.database()

  return Promise.all([
    db.ref('courses/meta')
      .child(courseKey)
      .child('createdBy')
      .once('value'),
    db.ref('courses/relationships')
      .child(courseKey)
      .child('instructors')
      .once('value')
  ])
  .then(([createdBySnapshot, instructorsSnapshot]) => {
    let instructorLookups = []
    instructorLookups.push(readUserById(createdBySnapshot.val()))
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
      if (user.github) {
        delete user.github.scope
        delete user.github.token
        delete user.github.tokenType
      }
      instructors[uid] = user
    })
    return instructors
  })
}
