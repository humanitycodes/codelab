import firebase from 'firebase-admin'
import encodeKey from '../../../firebase/src/utils/encode-key'

function createCourseEnrollment (courseKey, userId) {
  return firebase.database()
    .ref('courses/relationships')
    .child(courseKey)
    .child('students')
    .child(userId)
    .set({
      createdAt: new Date().getTime(),
      createdBy: userId
    })
}

function deleteCoursePreenrollment (courseKey, email) {
  const encodedEmail = encodeKey(email)
  return firebase.database()
    .ref('courses/fieldGroups/small/instructor')
    .child(courseKey)
    .child('preenrollments')
    .child(encodedEmail)
    .remove()
}

export async function confirmPreenrollments (email, userId) {
  const encodedEmail = encodeKey(email)
  let courseRef = firebase.database().ref('courses/fieldGroups/small/instructor')

  return new Promise((resolve, reject) => {
    courseRef.orderByChild(`preenrollments/${encodedEmail}`)
    .once('value')
    .then(courseSnapshot => {
      if (courseSnapshot && courseSnapshot.exists()) {
        return Object.keys(courseSnapshot.val())
      }
    })
    .then(courseKeys => {
      let courseActions = []
      courseKeys.forEach(courseKey => {
        courseActions.push(createCourseEnrollment(courseKey, userId))
        courseActions.push(deleteCoursePreenrollment(courseKey, email))
      })
      return Promise.all(courseActions)
    })
    .then(resolve)
    .catch(reject)
  })
}
