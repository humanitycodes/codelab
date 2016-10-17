import axios from 'axios'
import querystring from 'querystring'

export async function requestToken (code, callback) {
  return axios.post('https://oauth.ais.msu.edu/oauth/token', querystring.stringify({
    code: code,
    client_id: process.env.MSU_AUTH_CLIENT_ID,
    client_secret: process.env.MSU_AUTH_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: `${process.env.SERVER_BASE_URL}/auth/msu/callback`
  }))
}
