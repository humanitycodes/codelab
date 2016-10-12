const msunet = require('./msunet')

const API_PREFIX = '/api/'
const AUTH_PREFIX = '/auth/'

export default server => {
  server.route({
    method: 'GET',
    path: `${API_PREFIX}authenticated`,
    config: {
      auth: {
        // https://github.com/dwyl/hapi-auth-jwt2#authentication-modes
        mode: 'try',
        strategy: 'jwt'
      },
      handler (request, reply) {
        reply({ authenticated: request.auth.isAuthenticated })
      }
    }
  })

  server.route({
    method: 'GET',
    path: `${AUTH_PREFIX}msu/callback`,
    config: {
      auth: false
    },
    handler (request, reply) {
      msunet.requestToken(request.query.code, (error, data) => {
        if (error) {
          reply({ authenticated: false, error: error.message, response: error.response.data })
        } else {
          reply({ authenticated: true, token: data.access_token })
        };
      })
    }
  })
}
