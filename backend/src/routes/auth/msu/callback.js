import joi from 'joi'
import boom from '@hapi/boom'
import signJsonWebToken from 'helpers/jwt/sign-json-web-token'
import sequelize from 'db/sequelize'
import registerNewUser from '../_helpers/register-new-user'
import readUserRecordByEmail from 'db/user/read-by-email'
import translateUserFromRecord from 'translators/user/from-record'
import requestMsuUserProfile from 'services/msu/request-user-profile'
import serverBaseUrl from '../../../../env/server-base-url'

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
  async handler (request, h) {
    let transaction
    try {
      transaction = await sequelize.transaction()

      // Lookup the user from MSU and then from the DB
      const msuProfile = await requestMsuUserProfile(request.query.code)
      let userRecord = await readUserRecordByEmail(msuProfile.email, { transaction })

      if (!userRecord) {
        userRecord = await registerNewUser({
          email: msuProfile.email,
          fullName: msuProfile.name,
          msuUid: msuProfile.id
        }, { transaction })
      }

      const user = translateUserFromRecord({ authUser: userRecord, userRecord })
      const jwt = signJsonWebToken({ user })

      await transaction.commit()

      // The Base64 JWT can contain + symbols, so encode it because the token
      // is being sent to the client via the URL as a query parameter
      const encodedJwt = encodeURIComponent(jwt)
      return h.redirect(`${serverBaseUrl}/sign-in?token=${encodedJwt}`)
    } catch (error) {
      console.error(
        `Unable to sign MSU user in with code ${request.query.code}.`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.unauthorized(error.message)
    }
  }
}
