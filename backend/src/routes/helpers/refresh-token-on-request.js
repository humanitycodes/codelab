import readUserById from '../../db/user/read-by-id'
import translateUserFromRecord from '../../translators/user/from-record'
import signJsonWebToken from '../../helpers/jwt/sign-json-web-token'

// If the client has been successfully authenticated, update the token with
// the latest user information. This guarantees the request handler has the
// correct permissions for the user.
export default {
  type: 'onPostAuth',
  method (request, h) {
    let jwt = request.auth.credentials
    if (jwt && jwt.user) {
      return readUserById(jwt.user.userId)
        .then(userRecord => {
          if (userRecord) {
            jwt.user = translateUserFromRecord({
              authUser: jwt.user,
              userRecord
            })
            request.headers['x-token-refresh'] = signJsonWebToken(jwt)
          } else {
            request.headers['x-token-refresh'] = ''
          }
          return h.continue
        })
    }
    return h.continue
  }
}
