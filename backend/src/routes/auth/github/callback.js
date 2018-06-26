import joi from 'joi'
import boom from 'boom'
import { config } from '../../../../env/config'
import signJsonWebToken from '../../../helpers/jwt/sign-json-web-token'
import decodeJsonWebToken from '../../../helpers/jwt/decode-json-web-token'
import sequelize from '../../../db/sequelize'
import readUserById from '../../../db/user/read-by-id'
import updateUser from '../../../db/user/update'
import translateUserFromRecord from '../../../translators/user/from-record'
import getGitHubAccessToken from '../../../services/github/get-access-token'
import getGitHubUserProfile from '../../../services/github/get-user-profile'

export default {
  method: 'GET',
  path: '/github/callback/{returnPath*}',
  config: {
    auth: false,
    validate: {
      query: {
        code: joi.string().required(),
        state: joi.string()
      }
    }
  },
  async handler (request, h) {
    let transaction
    try {
      transaction = await sequelize.transaction()

      let jwt = decodeURIComponent(request.query.state)
      const authUser = decodeJsonWebToken(jwt).user

      // Lookup the user from the DB and GitHub
      let [userRecord, tokenBody] = await [
        readUserById(authUser.userId),
        getGitHubAccessToken(request.query.code)
      ]

      if (!userRecord) {
        throw new Error(`User ${authUser.userId} (${authUser.fullName}) not found.`)
      }

      const githubProfile = await getGitHubUserProfile(tokenBody.access_token)

      // Update the GitHub profile fields
      userRecord.githubUserId = githubProfile.id
      userRecord.githubLogin = githubProfile.login
      userRecord.githubScope = tokenBody.scope
      userRecord.githubToken = tokenBody.access_token
      userRecord.githubTokenType = tokenBody.token_type

      await updateUser(userRecord)

      // Regenerate the JWT to keep the client in sync
      const user = translateUserFromRecord({ authUser, userRecord })
      jwt = signJsonWebToken({ user })

      await transaction.commit()

      // The Base64 JWT can contain + symbols, so encode it because the token
      // is being sent to the client via the URL as a query parameter
      const encodedJwt = encodeURIComponent(jwt)
      return h.redirect(
        `${config.serverBaseURL}/sign-in` +
        `?token=${encodedJwt}` +
        `&returnPath=/${request.params.returnPath}`
      )
    } catch (error) {
      console.error(
        `Unable to connect GitHub account with state ${request.query.state}.`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.unauthorized(error.message)
    }
  }
}
