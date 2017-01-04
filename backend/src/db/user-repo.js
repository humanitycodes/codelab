import firebase from 'firebase-admin'

import { confirmPreenrollments } from './course-repo'

const SIGNUP_ROLES = {
  instructor: false
}

export async function createUser (userId, user) {
  let db = firebase.database()

  return new Promise((resolve, reject) => {
    Promise.all([
      db.ref('users').child(userId).set(user),
      db.ref('roles').child(userId).set(SIGNUP_ROLES)
    ])
    .then(([usersCallback, rolesCallback]) => {
      return confirmPreenrollments(user.email, userId)
    })
    .then(() => {
      resolve(user)
    })
    .catch(reject)
  })
}

export async function readUserById (userId) {
  let userRef = firebase.database().ref('users').child(userId)

  return new Promise((resolve, reject) => {
    userRef.once('value')
    .then(userSnapshot => {
      if (userSnapshot && userSnapshot.exists()) {
        resolve([userId, userSnapshot.val()])
      } else {
        resolve([null, null])
      }
    })
    .catch(reject)
  })
}

export async function readUserByMsuUid (msuUid) {
  let usersRef = firebase.database().ref('users')

  return new Promise((resolve, reject) => {
    usersRef.orderByChild('msuUid').equalTo(msuUid).once('value')
    .then(userSnapshot => {
      if (userSnapshot && userSnapshot.exists()) {
        if (userSnapshot.numChildren() === 1) {
          const userResults = userSnapshot.val()
          const userId = Object.keys(userResults)[0]
          resolve([userId, userResults[userId]])
        } else {
          reject(new Error(`Incorrect number of users found for MSU NetID ${msuUid}.`))
        }
      } else {
        resolve([null, null])
      }
    })
    .catch(reject)
  })
}

export async function readUserByGitHubLogin (githubLogin) {
  let usersRef = firebase.database().ref('users')

  return new Promise((resolve, reject) => {
    usersRef.orderByChild('github/login').equalTo(githubLogin).once('value')
    .then(userSnapshot => {
      if (userSnapshot && userSnapshot.exists()) {
        if (userSnapshot.numChildren() === 1) {
          const userResults = userSnapshot.val()
          const userId = Object.keys(userResults)[0]
          resolve([userId, userResults[userId]])
        } else {
          reject(new Error(`Incorrect number of users found for GitHub login ${githubLogin}.`))
        }
      } else {
        resolve([null, null])
      }
    })
    .catch(reject)
  })
}

export async function saveUserGitHubProfile (userId, githubProfile) {
  let db = firebase.database().ref('users').child(userId).child('github')

  return new Promise((resolve, reject) => {
    db.set(githubProfile)
    .then(userGithubCallback => {
      resolve(githubProfile)
    })
    .catch(reject)
  })
}
