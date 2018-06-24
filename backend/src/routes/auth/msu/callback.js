import joi from 'joi'
import boom from 'boom'
import { config } from '../../../../env/config'
import signJsonWebToken from '../../../helpers/jwt/sign-json-web-token'
import sequelize from '../../../db/sequelize'
import createUser from '../../../db/user/create'
import readUserByMsuUid from '../../../db/user/read-by-msu-uid'
import translateUserFromRecord from '../../../translators/user/from-record'
import requestMsuUserProfile from '../../../services/msu/request-user-profile'

export default {
  method: 'GET',
  path: '/msu/callback',
  config: {
    auth: false,
    validate: {
      query: {
        code: joi.string().required()
      }
    }
  },
  handler: function* (request, h) {
    let transaction
    try {
      transaction = yield sequelize.transaction()

      // Lookup the user from MSU and then from the DB
      const msuProfile = yield requestMsuUserProfile(request.query.code)
      let userRecord = yield readUserByMsuUid(msuProfile.id, { transaction })

      if (!userRecord) {
        userRecord = yield createUser({
          email: msuProfile.email,
          fullName: msuProfile.name,
          msuUid: msuProfile.id
        }, { transaction })
      }

      const user = translateUserFromRecord({ authUser: userRecord, userRecord })
      const jwt = signJsonWebToken({ user })

      yield transaction.commit()

      // The Base64 JWT can contain + symbols, so encode it because the token
      // is being sent to the client via the URL as a query parameter
      const encodedJwt = encodeURIComponent(jwt)
      return h.redirect(`${config.serverBaseURL}/sign-in?token=${encodedJwt}`)
    } catch (error) {
      console.error(
        `Unable to sign MSU user in with code ${request.query.code}.`,
        'Reason:', error
      )
      yield transaction.rollback()
      return boom.unauthorized(error.message)
    }
  }
}
