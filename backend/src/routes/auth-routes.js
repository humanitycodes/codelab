import joi from 'joi'
import boom from 'boom'
import firebase from 'firebase'

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
      try {
        let loginProfile = yield msuOAuth.requestLoginProfile(request.query.code)

        const jwt = firebase.auth().createCustomToken(loginProfile.id, {
          msu: loginProfile
        })

        // The Base64 JWT can contain + symbols, so encode it
        const encodedJwt = encodeURIComponent(jwt)
        reply().redirect(`${process.env.SERVER_BASE_URL}/login?token=${encodedJwt}`)
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
          code: joi.string().required()
        }
      }
    },
    handler: function* (request, reply) {
      try {
        let loginProfile = yield githubOAuth.requestLoginProfile(request.query.code)
        reply(loginProfile)
      } catch (error) {
        reply(boom.unauthorized(error.message))
      }
    }
  }
]
