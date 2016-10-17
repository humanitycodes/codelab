import joi from 'joi'
import boom from 'boom'

const msuOAuth = require('../oauth-providers/msu-oauth')

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
        let response = yield msuOAuth.requestToken(request.query.code)
        reply(response.data)
      } catch (error) {
        reply(boom.unauthorized(error.response.data.error_description))
      }
    }
  }
]
