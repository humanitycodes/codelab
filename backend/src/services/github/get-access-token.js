import axios from 'axios'
import { config } from '../../../env/config'
import CODELAB_GITHUB_AUTH_CLIENT_SECRET from '../../../env/github-auth-client-secret'

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
      client_secret: CODELAB_GITHUB_AUTH_CLIENT_SECRET,
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
