import joi from 'joi'
import boom from 'boom'

import * as env from '../../env/config'
import * as userRepo from '../db/user-repo'
import signJsonWebToken from '../helpers/jwt/sign-json-web-token'

import sequelize from '../db/sequelize'
import readUserByMsuUid from '../db/user/read-by-msu-uid'
import createUser from '../db/user/create'

const msuOAuth = require('../oauth-providers/msu-oauth')
const githubOAuth = require('../oauth-providers/github-oauth')

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

        const msuProfile = yield msuOAuth.requestLoginProfile(request.query.code)
        let userRecord = yield readUserByMsuUid(msuProfile.id, { transaction })

        if (!userRecord) {
          userRecord = yield createUser({
            email: msuProfile.email,
            fullName: msuProfile.name,
            msuUid: msuProfile.id
          }, { transaction })
        }

        const user = userRecord.get()
        const jwt = signJsonWebToken({ user })

        yield transaction.commit()

        // The Base64 JWT can contain + symbols, so encode it because the token
        // is being sent to the client via the URL as a query parameter
        const encodedJwt = encodeURIComponent(jwt)
        h.redirect(`${env.config.serverBaseURL}/sign-in?token=${encodedJwt}`)
      } catch (error) {
        console.error(`Unable to sign MSU user in with code ${request.query.code}. Reason:`, error)
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
      try {
        const token = {}

        const [userId, user] = yield userRepo.readUserById(token.uid)
        if (!user) {
          throw new Error(`User ${token.uid} not found.`)
        }

        const githubProfile = yield githubOAuth.requestLoginProfile(request.query.code)
        yield userRepo.saveUserGitHubProfile(userId, githubProfile)

        h.redirect(`${env.config.serverBaseURL}/${request.params.returnPath}`)
      } catch (error) {
        console.error(`Unable to connect GitHub account with state ${request.query.state}. Reason:`, error)
        return boom.unauthorized(error.message)
      }
    }
  }
]
