import axios from 'axios'

function getFromGitHub (path, token) {
  const githubAuthBaseUrl = process.env.GITHUB_AUTH_BASE_URL || 'https://api.github.com'

  return axios({
    method: 'get',
    url: `${githubAuthBaseUrl}${path}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  })
}

export async function requestLoginProfile (code) {
  let githubProfile = {}
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
        githubProfile.tokenType = response.data.token_type
        githubProfile.token = response.data.access_token
        githubProfile.scope = response.data.scope

        return getFromGitHub('/user', githubProfile.token)
      }
    })
    .then(response => {
      githubProfile.userId = response.data.id
      githubProfile.login = response.data.login
      resolve(githubProfile)
    })
    .catch(reject)
  })
}
