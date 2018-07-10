export default {
  method: 'GET',
  path: '/authenticated',
  async handler (request, h) {
    return {
      authenticated: request.auth.isAuthenticated
    }
  }
}
