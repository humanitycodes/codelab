import joi from 'joi'
import boom from 'boom'
import firebase from 'firebase-admin'
import uuid from 'uuid'
import { verifyJWT } from '../helpers/verify-firebase-jwt'
import * as env from '../../env/config'

const msuOAuth = require('../oauth-providers/msu-oauth')
const githubOAuth = require('../oauth-providers/github-oauth')
const userRepo = require('../db/user-repo')

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
      try {
        let msuProfile = yield msuOAuth.requestLoginProfile(request.query.code)

        let [userId, user] = yield userRepo.readByMsuUid(msuProfile.id)

        if (!user) {
          userId = uuid.v4()
          user = yield userRepo.create(userId, {
            msuUid: msuProfile.id,
            fullName: msuProfile.name,
            email: msuProfile.email
          })
        }

        const jwt = yield firebase.auth().createCustomToken(userId, {
          profile: user
        })

        // The Base64 JWT can contain + symbols, so encode it
        const encodedJwt = encodeURIComponent(jwt)
        reply().redirect(`${env.config.serverBaseURL}/sign-in?token=${encodedJwt}`)
      } catch (error) {
        reply(boom.unauthorized(error.message))
      }
    }
  },
  {
    method: 'GET',
    path: `/github/callback`,
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

        const [userId, user] = yield userRepo.readById(token.uid)
        if (!user) {
          throw new Error(`User ${token.uid} not found.`)
        }

        const githubProfile = yield githubOAuth.requestLoginProfile(request.query.code)
        yield userRepo.saveGitHubProfile(userId, githubProfile)

        reply().redirect(`${env.config.serverBaseURL}/`)
      } catch (error) {
        reply(boom.unauthorized(error.message))
      }
    }
  }
]
