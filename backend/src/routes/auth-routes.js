import joi from 'joi'
import boom from 'boom'

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
        let oauth = yield msuOAuth.requestToken(request.query.code)
        reply(oauth)
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
        let oauth = yield githubOAuth.requestToken(request.query.code)
        reply(oauth)
      } catch (error) {
        reply(boom.unauthorized(error.message))
      }
    }
  }
]
