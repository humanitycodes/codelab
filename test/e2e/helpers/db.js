import firebase from 'firebase-admin'

import * as firebaseSettings from '../../../backend/src/firebase-settings'

// ------
// SETUP
// ------

export function init () {
  return firebase.initializeApp(firebaseSettings.appConfig)
}

export function close () {
  return firebase.app().delete()
}

// ------
// USERS
// ------

export const USER_PASSWORD = 'toomanysecrets'

export function createUser (user) {
  let db = firebase.database()
  return Promise.all([
    firebase.auth().createUser({
      uid: user.uid,
      email: user.email,
      emailVerified: true,
      displayName: user.fullName,
      password: USER_PASSWORD
    }),
    db.ref('users').child(user.uid).set({
      email: user.email,
      fullName: user.fullName
    }),
    db.ref('roles').child(user.uid).set({
      instructor: false
    })
  ])
}

export function destroyUser (user) {
  if (!user) return Promise.resolve()

  let db = firebase.database()
  return Promise.all([
    db.ref('roles').child(user.uid).remove(),
    db.ref('users').child(user.uid).remove(),
    firebase.auth().deleteUser(user.uid)
  ])
}
