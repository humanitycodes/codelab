import joi from 'joi'
import boom from 'boom'
import firebase from 'firebase-admin'

import { verifyJWT } from '../helpers/verify-firebase-jwt'
import * as env from '../../env/config'
import * as userRepo from '../db/user-repo'

import sequelize from '../db/sequelize'
import readUserByMsuUid from '../db/user/read-by-msu-uid'
import createUser from '../db/user/create'

const msuOAuth = require('../oauth-providers/msu-oauth')
const githubOAuth = require('../oauth-providers/github-oauth')

export const config = [
  {
    method: 'GET',
    path: `/msu/callback`,
    config: {
      validate: {
        query: {
          code: joi.string().required()
        }
      }
    },
    handler: function* (request, reply) {
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

          yield userRepo.createUser(msuProfile.id, {
            msuUid: msuProfile.id,
            fullName: msuProfile.name,
            email: msuProfile.email
          })
        }

        const user = userRecord.get()
        const jwt = yield firebase.auth().createCustomToken(msuProfile.id, {
          profile: user
        })

        yield transaction.commit()

        // The Base64 JWT can contain + symbols, so encode it
        const encodedJwt = encodeURIComponent(jwt)
        reply().redirect(`${env.config.serverBaseURL}/sign-in?token=${encodedJwt}`)
      } catch (error) {
        console.error(`Unable to sign MSU user in with code ${request.query.code}. Reason:`, error)
        yield transaction.rollback()
        reply(boom.unauthorized(error.message))
      }
    }
  },
  {
    method: 'GET',
    path: `/github/callback/{returnPath*}`,
    config: {
      validate: {
        query: {
          code: joi.string().required(),
          state: joi.string()
        }
      }
    },
    handler: function* (request, reply) {
      try {
        const token = yield verifyJWT(null, { auth: { token: decodeURIComponent(request.query.state) } })

        const [userId, user] = yield userRepo.readUserById(token.uid)
        if (!user) {
          throw new Error(`User ${token.uid} not found.`)
        }

        const githubProfile = yield githubOAuth.requestLoginProfile(request.query.code)
        yield userRepo.saveUserGitHubProfile(userId, githubProfile)

        reply().redirect(`${env.config.serverBaseURL}/${request.params.returnPath}`)
      } catch (error) {
        console.error(`Unable to connect GitHub account with state ${request.query.state}. Reason:`, error)
        reply(boom.unauthorized(error.message))
      }
    }
  }
]
