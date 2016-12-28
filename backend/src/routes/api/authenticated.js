export default {
  method: 'GET',
  path: `/authenticated`,
  config: {
    auth: {
      mode: 'try',
      strategy: 'jwt'
    }
  },
  handler: (request, reply) => {
    reply({ authenticated: request.auth.isAuthenticated })
  }
}
