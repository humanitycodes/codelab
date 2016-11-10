import axios from 'axios'
import querystring from 'querystring'

export async function requestLoginProfile (code, callback) {
  let msuProfile = {
    provider: 'msu'
  }
  return new Promise((resolve, reject) => {
    axios.post('https://oauth.ais.msu.edu/oauth/token', querystring.stringify({
      code: code,
      client_id: process.env.MSU_AUTH_CLIENT_ID,
      client_secret: process.env.MSU_AUTH_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.SERVER_BASE_URL}/auth/msu/callback`
    }))
    .then(response => {
      msuProfile.type = response.data.token_type
      msuProfile.token = response.data.access_token
      return axios.get(`https://oauth.ais.msu.edu/oauth/me?access_token=${msuProfile.token}`)
    })
    .then(response => {
      msuProfile.id = response.data.uid
      msuProfile.name = response.data.info.name
      msuProfile.email = response.data.info.email
      resolve(msuProfile)
    })
    .catch(error => {
      reject(new Error(error.response.data.error_description, error))
    })
  })
}
