import firebase from 'firebase'

const SIGNUP_ROLES = {
  instructor: false,
  admin: false
}

export async function readByMsuUid (msuUid) {
  let usersRef = firebase.database().ref('users')

  return new Promise((resolve, reject) => {
    usersRef.orderByChild('msuUid').equalTo(msuUid).once('value')
    .then(userSnapshot => {
      if (userSnapshot && userSnapshot.exists()) {
        if (userSnapshot.numChildren() !== 1) {
          reject(new Error(`More than one user found for MSU NetID ${msuUid}.`))
          return
        }
        const userResults = userSnapshot.val()
        const userId = Object.keys(userResults)[0]
        let user = userResults[userId]
        user.id = userId
        resolve(user)
      } else {
        resolve(null)
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
      resolve({
        id: id,
        ...user
      })
    })
    .catch(reject)
  })
}
