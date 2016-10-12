import axios from 'axios'
import querystring from 'querystring'

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
      axios.post('https://oauth.ais.msu.edu/oauth/token', querystring.stringify({
        code: request.query.code,
        client_id: process.env.MSU_AUTH_CLIENT_ID,
        client_secret: process.env.MSU_AUTH_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.SERVER_BASE_URL}/auth/msu/callback`
      })).then(response => {
        reply({ authenticated: true, status: response.status, response: response.data })
      }).catch(error => {
        reply({ authenticated: false, error: error.message, status: error.response.status, response: error.response.data })
      })
    }
  })
}
