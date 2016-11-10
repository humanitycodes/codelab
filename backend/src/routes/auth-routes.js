import joi from 'joi'
import boom from 'boom'
import firebase from 'firebase'
import uuid from 'uuid'
import JWT from 'jsonwebtoken'
import { verifyJWTOptions, verifyJWT } from '../helpers/verify-firebase-jwt'

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

        let user = yield userRepo.readByMsuUid(msuProfile.id)

        if (!user) {
          user = yield userRepo.create(uuid.v4(), {
            msuUid: msuProfile.id,
            fullName: msuProfile.name,
            email: msuProfile.email
          })
        }

        const jwt = firebase.auth().createCustomToken(user.id, {
          profile: user
        })

        // The Base64 JWT can contain + symbols, so encode it
        const encodedJwt = encodeURIComponent(jwt)
        reply().redirect(`${process.env.SERVER_BASE_URL}/sign-in?token=${encodedJwt}`)
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
        const decodedToken = JWT.decode(decodeURIComponent(request.query.state), { complete: verifyJWTOptions.complete || false })
        yield verifyJWT(decodedToken)

        const githubProfile = yield githubOAuth.requestLoginProfile(request.query.code)
        reply(githubProfile)
      } catch (error) {
        reply(boom.unauthorized(error.message))
      }
    }
  }
]
