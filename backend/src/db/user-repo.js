import firebase from 'firebase'

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
  let usersRef = firebase.database().ref('users')
  let rolesRef = firebase.database().ref('roles')

  return new Promise((resolve, reject) => {
    Promise.all([
      usersRef.child(id).set(user),
      rolesRef.child(id).set({ student: true })
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
