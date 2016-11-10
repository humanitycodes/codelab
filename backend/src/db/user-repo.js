import firebase from 'firebase'

const SIGNUP_ROLES = {
  instructor: false,
  admin: false
}

export async function readByUid (uid) {
  let userRef = firebase.database().ref('users').child(uid)

  return new Promise((resolve, reject) => {
    userRef.once('value')
    .then(userSnapshot => {
      if (userSnapshot && userSnapshot.exists()) {
        resolve([uid, userSnapshot.val()])
      } else {
        resolve([null, null])
      }
    })
    .catch(reject)
  })
}

export async function readByMsuUid (msuUid) {
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

export async function create (id, user) {
  let db = firebase.database()

  return new Promise((resolve, reject) => {
    Promise.all([
      db.ref('users').child(id).set(user),
      db.ref('roles').child(id).set(SIGNUP_ROLES)
    ])
    .then(([usersCallback, rolesCallback]) => {
      resolve(user)
    })
    .catch(reject)
  })
}
