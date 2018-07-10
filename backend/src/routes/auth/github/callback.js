import joi from 'joi'
import boom from 'boom'
import { config } from '../../../../env/config'
import signJsonWebToken from '../../../helpers/jwt/sign-json-web-token'
import decodeJsonWebToken from '../../../helpers/jwt/decode-json-web-token'
import sequelize from '../../../db/sequelize'
import registerNewUser from '../_helpers/register-new-user'
import readUserRecordById from '../../../db/user/read-by-id'
import readUserRecordByGitHubLogin from '../../../db/user/read-by-github-login'
import updateUserRecord from '../../../db/user/update'
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
        state: joi.string().allow(null)
      }
    }
  },
  async handler (request, h) {
    let transaction
    try {
      transaction = await sequelize.transaction()

      // Lookup the user from GitHub
      const tokenBody = await getGitHubAccessToken(request.query.code)
      const githubProfile = await getGitHubUserProfile(tokenBody.access_token)

      let userRecord
      if (request.query.state) {
        // User already logged in, use JWT to find user record
        const jwt = decodeURIComponent(request.query.state)
        const authUser = decodeJsonWebToken(jwt).user
        userRecord = await readUserRecordById(
          authUser.userId, { transaction }
        )
        if (!userRecord) {
          throw new Error(
            `User ${authUser.userId} (${authUser.fullName}) not found.`
          )
        }
      } else {
        // Signing in with GitHub, use GitHub profile to find user record
        userRecord = await readUserRecordByGitHubLogin(
          githubProfile.login, { transaction }
        )
        if (!userRecord) {
          userRecord = await registerNewUser({
            email: githubProfile.email,
            fullName: githubProfile.name
          }, { transaction })
        }
      }

      // Update the GitHub profile fields
      userRecord.githubUserId = githubProfile.id
      userRecord.githubLogin = githubProfile.login
      userRecord.githubScope = tokenBody.scope
      userRecord.githubToken = tokenBody.access_token
      userRecord.githubTokenType = tokenBody.token_type

      await updateUserRecord(userRecord, { transaction })

      // Regenerate the JWT to keep the client in sync
      const user = translateUserFromRecord({
        authUser: userRecord, userRecord
      })
      const jwt = signJsonWebToken({ user })

      await transaction.commit()

      // The Base64 JWT can contain + symbols, so encode it because the token
      // is being sent to the client via the URL as a query parameter
      const encodedJwt = encodeURIComponent(jwt)
      let url = `${config.serverBaseURL}/sign-in?token=${encodedJwt}`
      if (request.query.state) {
        url += `&returnPath=/${request.params.returnPath}`
      }
      return h.redirect(url)
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
