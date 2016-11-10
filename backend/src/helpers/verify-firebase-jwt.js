import firebase from 'firebase'

export const verifyJWTOptions = {
  ignoreExpiration: true
}

export function verifyJWT (decoded, request, callback) {
  return firebase.auth().verifyIdToken(request.auth.token)
    .then(decodedToken => {
      if (callback) {
        callback(null, !!decodedToken)
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
