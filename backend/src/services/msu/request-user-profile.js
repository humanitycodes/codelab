import axios from 'axios'
import querystring from 'querystring'
import { config } from '../../../env/config'

export default async code => {
  let msuProfile = {
    provider: 'msu'
  }
  return new Promise((resolve, reject) => {
    axios.post(`${config.msuAuthBaseURL}/oauth/token`, querystring.stringify({
      code: code,
      client_id: config.msuAuthClientID,
      client_secret: config.msuAuthClientSecret,
      grant_type: 'authorization_code',
      redirect_uri: `${config.serverBaseURL}/auth/msu/callback`
    }))
    .then(response => {
      msuProfile.type = response.data.token_type
      msuProfile.token = response.data.access_token
      return axios.get(`${config.msuAuthBaseURL}/oauth/me?access_token=${msuProfile.token}`)
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
