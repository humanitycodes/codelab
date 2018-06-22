import joi from 'joi'
import boom from 'boom'

import * as env from '../../env/config'
import signJsonWebToken from '../helpers/jwt/sign-json-web-token'
import decodeJsonWebToken from '../helpers/jwt/decode-json-web-token'

import sequelize from '../db/sequelize'
import createUser from '../db/user/create'
import readUserById from '../db/user/read-by-id'
import readUserByMsuUid from '../db/user/read-by-msu-uid'
import updateUser from '../db/user/update'

import translateUserFromRecord from '../translators/user/from-record'

import requestMsuUserProfile from '../services/msu/request-user-profile'
import getGitHubAccessToken from '../services/github/get-access-token'
import getGitHubUserProfile from '../services/github/get-user-profile'

export default [
  {
    method: 'GET',
    path: `/msu/callback`,
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
        return h.redirect(`${env.config.serverBaseURL}/sign-in?token=${encodedJwt}`)
      } catch (error) {
        console.error(
          `Unable to sign MSU user in with code ${request.query.code}.`,
          'Reason:', error
        )
        yield transaction.rollback()
        return boom.unauthorized(error.message)
      }
    }
  },
  {
    method: 'GET',
    path: `/github/callback/{returnPath*}`,
    config: {
      auth: false,
      validate: {
        query: {
          code: joi.string().required(),
          state: joi.string()
        }
      }
    },
    handler: function* (request, h) {
      let transaction
      try {
        transaction = yield sequelize.transaction()

        let jwt = decodeURIComponent(request.query.state)
        const authUser = decodeJsonWebToken(jwt).user

        // Lookup the user from the DB and GitHub
        let [userRecord, tokenBody] = yield [
          readUserById(authUser.userId),
          getGitHubAccessToken(request.query.code)
        ]

        if (!userRecord) {
          throw new Error(`User ${authUser.userId} (${authUser.fullName}) not found.`)
        }

        const githubProfile = yield getGitHubUserProfile(tokenBody.access_token)

        // Update the GitHub profile fields
        userRecord.githubUserId = githubProfile.id
        userRecord.githubLogin = githubProfile.login
        userRecord.githubScope = tokenBody.scope
        userRecord.githubToken = tokenBody.access_token
        userRecord.githubTokenType = tokenBody.token_type

        yield updateUser(userRecord)

        // Regenerate the JWT to keep the client in sync
        const user = translateUserFromRecord({ authUser, userRecord })
        jwt = signJsonWebToken({ user })

        yield transaction.commit()

        // The Base64 JWT can contain + symbols, so encode it because the token
        // is being sent to the client via the URL as a query parameter
        const encodedJwt = encodeURIComponent(jwt)
        return h.redirect(
          `${env.config.serverBaseURL}/sign-in` +
          `?token=${encodedJwt}` +
          `&returnPath=/${request.params.returnPath}`
        )
      } catch (error) {
        console.error(
          `Unable to connect GitHub account with state ${request.query.state}.`,
          'Reason:', error
        )
        yield transaction.rollback()
        return boom.unauthorized(error.message)
      }
    }
  }
]
