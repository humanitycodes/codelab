import firebase from 'firebase'

export const verifyJWTOptions = {
  ignoreExpiration: true
}

export function verifyJWT (decoded, request, callback) {
  return firebase.auth().verifyIdToken(request.auth.token)
    .then(decodedToken => {
      const uid = decodedToken.uid
      console.log(uid)

      if (callback) {
        callback(null, true)
      } else {
        return Promise.resolve(decodedToken)
      }
    }).catch(error => {
      if (callback) {
        callback(error, false)
      } else {
        return Promise.reject(error)
      }
    })
}
