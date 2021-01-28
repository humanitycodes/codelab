import joi from 'joi'
import boom from '@hapi/boom'
import signJsonWebToken from 'helpers/jwt/sign-json-web-token'
import decodeJsonWebToken from 'helpers/jwt/decode-json-web-token'
import sequelize from 'db/sequelize'
import registerNewUser from '../_helpers/register-new-user'
import readUserRecordById from 'db/user/read-by-id'
import readUserRecordByGitHubLogin from 'db/user/read-by-github-login'
import updateUserRecord from 'db/user/update'
import translateUserFromRecord from 'translators/user/from-record'
import getGitHubAccessToken from 'services/github/get-access-token'
import getGitHubUserProfile from 'services/github/get-user-profile'
import getGitHubUserEmails from 'services/github/get-user-emails'
import serverBaseUrl from '../../../../env/server-base-url'

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
      const githubToken = tokenBody.access_token
      const githubProfile = await getGitHubUserProfile(githubToken)

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
          // Lookup primary email and register new user
          const fullName = githubProfile.name || githubProfile.login
          const githubEmails = await getGitHubUserEmails(githubToken)
          const email = githubEmails.find(
            githubEmail => githubEmail.primary
          ).email
          userRecord = await registerNewUser(
            { email, fullName }, { transaction }
          )
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
      let url = `${serverBaseUrl}/sign-in?token=${encodedJwt}`
      if (request.query.state && request.params.returnPath) {
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
