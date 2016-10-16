import joi from 'joi'

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
    handler (request, reply) {
      msuOAuth.requestToken(request.query.code, (error, data) => {
        if (error) {
          reply({ authenticated: false, error: error.message, response: error.response.data })
        } else {
          reply({ authenticated: true, token: data.access_token })
        }
      })
    }
  }
]
