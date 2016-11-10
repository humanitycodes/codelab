import firebase from 'firebase'

const userRepo = require('../db/user-repo')

export const verifyJWTOptions = {
  ignoreExpiration: true
}

export function verifyJWT (decoded, request, callback) {
  let token
  return firebase.auth().verifyIdToken(request.auth.token)
    .then(decodedToken => {
      token = decodedToken
      return userRepo.readByUid(token.uid)
    }).then(([uid, user]) => {
      if (!user) {
        throw new Error(`User ${token.uid} not found.`)
      }
      if (callback) {
        callback(null, true)
      } else {
        return Promise.resolve(token)
      }
    }).catch(error => {
      if (callback) {
        callback(error, false)
      } else {
        return Promise.reject(error)
      }
    })
}
