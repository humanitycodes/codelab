import readUserById from 'db/user/read-by-id'
import translateUserFromRecord from 'translators/user/from-record'
import signJsonWebToken from 'helpers/jwt/sign-json-web-token'

const isUserVersionDifferent = (oldUser, newUser) => {
  // No changes if they're both null
  if (!oldUser && !newUser) return false

  // Different if one (and only one) user is not null
  if (oldUser ? !newUser : !!newUser) return true

  return oldUser.version !== newUser.version
}

// If the client has been successfully authenticated and their user record has
// changed since they received their JWT, update the token with the latest user
// information. This guarantees the request handler has the correct permissions
// for the user.
export default {
  type: 'onPostAuth',
  method (request, h) {
    let jwt = request.auth.credentials
    if (jwt && jwt.user) {
      return readUserById(jwt.user.userId)
        .then(userRecord => {
          // Only send a new token if the latest user record is newer than
          // what's on the client's token.
          if (isUserVersionDifferent(jwt.user, userRecord)) {
            if (userRecord) {
              jwt.user = translateUserFromRecord({
                authUser: jwt.user,
                userRecord
              })
              request.headers['x-token-refresh'] = signJsonWebToken(jwt)
            } else {
              // If the user doesn't exist, clear the client token.
              request.headers['x-token-refresh'] = ''
            }
          }
          return h.continue
        })
    }
    return h.continue
  }
}
