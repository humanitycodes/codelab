import axios from 'axios'
import querystring from 'querystring'
import msuAuthClientId from '../../../env/msu-auth-client-id'
import msuAuthClientSecret from '../../../env/msu-auth-client-secret'
import serverBaseUrl from '../../../env/server-base-url'

const msuAuthBaseUrl = 'https://oauth.itservices.msu.edu'

export default async code => {
  const msuProfile = {
    provider: 'msu'
  }
  return axios.post(`${msuAuthBaseUrl}/oauth/token`, querystring.stringify({
    code: code,
    client_id: msuAuthClientId,
    client_secret: msuAuthClientSecret,
    grant_type: 'authorization_code',
    redirect_uri: `${serverBaseUrl}/auth/msu/callback`
  }))
  .then(response => {
    msuProfile.type = response.data.token_type
    msuProfile.token = response.data.access_token
    return axios.get(`${msuAuthBaseUrl}/oauth/me?access_token=${msuProfile.token}`)
  })
  .then(response => {
    msuProfile.id = response.data.uid
    msuProfile.name = response.data.info.name
    msuProfile.email = response.data.info.email
    return msuProfile
  })
  .catch(error => {
    throw new Error(error.response.data.error_description, error)
  })
}
