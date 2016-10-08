const PREFIX = '/api/'

export default server => {
  server.route({
    method: 'GET',
    path: PREFIX + 'authenticated',
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
}
