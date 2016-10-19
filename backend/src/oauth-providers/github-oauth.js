import axios from 'axios'

export async function requestToken (code, callback) {
  return new Promise((resolve, reject) => {
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
        client_id: process.env.GITHUB_AUTH_CLIENT_ID,
        client_secret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        redirect_uri: `${process.env.SERVER_BASE_URL}/auth/github/callback`
      }
    })
    .then(response => {
      // 🙄 GitHub responds with 200 and an error object if there's a problem
      if (response.data.error_description) {
        reject(new Error(response.data.error_description))
      } else {
        resolve({
          provider: 'github',
          token: response.data.access_token,
          type: response.data.token_type,
          scope: response.data.scope
        })
      }
    })
    .catch(error => {
      reject(error)
    })
  })
}
