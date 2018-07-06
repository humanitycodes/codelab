import axios from 'axios'
import { config } from '../../../env/config'

export default async code =>
  axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token',
    headers: {
      // 🙄 GitHub responds with a query-like string when using Axios' default
      // Accept: 'application/json, text/plain, */*'
      Accept: 'application/json'
    },
    params: {
      code: code,
      client_id: config.githubAuthClientID,
      client_secret: config.githubAuthClientSecret,
      redirect_uri: `${config.serverBaseURL}/auth/github/callback`
    }
  })
  .then(response => {
    // 🙄 GitHub responds with 200 and an error object if there's a problem
    if (response.data.error_description) {
      throw new Error(response.data.error_description)
    }
    return response.data
  })
