import firebase from 'firebase-admin'

export async function create ({ uid, courseKey, lessonKey, projectKey }) {
  const db = firebase.database()
  const projectCompletionKey = [projectKey, uid].join('-')

  return new Promise((resolve, reject) => {
    // Make sure the student is in the course
    db.ref('courses/relationships')
      .child(courseKey)
      .child('students')
      .child(uid)
      .once('value', snapshot => {
        if (snapshot.val()) return resolve()
        db.ref('roles').child(uid).child('instructor')
          .once('value', snapshot => {
            snapshot.val()
              ? resolve()
              : reject('This user is not enrolled in the course or an instructor')
          })
      }, error => {
        reject('There was a problem communicating with Firebase:', error)
      })
  })
  .then(() => {
    // Make sure the student has not already submitted this project
    return new Promise((resolve, reject) => {
      db.ref('courses/fieldGroups/large/student')
        .child(courseKey)
        .child('projectCompletions')
        .child(projectCompletionKey)
        .once('value', snapshot => {
          snapshot.val()
            ? reject('A project for this repo has already been created')
            : resolve()
        }, error => {
          reject('There was a problem communicating with Firebase:', error)
        })
    })
  })
  .then(() => {
    // Create the project completion
    return update({ courseKey, projectCompletionKey }, {
      position: 1,
      students: { [uid]: { position: 1 } },
      lessonKey,
      projectKey
    })
  })
}

export async function readByPartialKey ({ uid, courseKey, lessonKey, projectKeyPart }) {
  const db = firebase.database()
  const partialCompletionKey = [projectKeyPart, uid].join('-')

  return new Promise((resolve, reject) => {
    db.ref('courses/fieldGroups/large/student')
      .child(courseKey)
      .child('projectCompletions')
      .orderByChild('lessonKey')
      .equalTo(lessonKey)
      .once('value')
      .then(snapshot => {
        let projectCompletions = {}
        Object.keys(snapshot.val()).forEach(projectCompletionKey => {
          if (projectCompletionKey.endsWith(partialCompletionKey)) {
            projectCompletions[projectCompletionKey] = snapshot.val()[projectCompletionKey]
          }
        })
        resolve(projectCompletions)
      })
      .catch(error => {
        reject('There was a problem communicating with Firebase:', error)
      })
  })
}

export async function update ({ courseKey, projectCompletionKey }, projectCompletion) {
  return firebase.database()
    .ref('courses/fieldGroups/large/student')
    .child(courseKey)
    .child('projectCompletions')
    .child(projectCompletionKey)
    .update(projectCompletion)
}
