import readUserById from '../db/user/read-by-id'
import translateUserFromRecord from '../translators/user/from-record'
import signJsonWebToken from '../helpers/jwt/sign-json-web-token'

export default {
  type: 'onPreResponse',
  method (request, h) {
    let jwt = request.auth.credentials
    if (request.response && jwt && jwt.user) {
      return readUserById(jwt.user.userId)
        .then(userRecord => {
          if (userRecord) {
            jwt.user = translateUserFromRecord({
              authUser: jwt.user,
              userRecord
            })
            request.response.headers['x-token-refresh'] = signJsonWebToken(jwt)
          } else {
            request.response.headers['x-token-refresh'] = ''
          }
          return h.continue
        })
    }
    return h.continue
  }
}
