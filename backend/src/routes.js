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
      reply({ authenticated: 'maybe' })
    }
  })
}
