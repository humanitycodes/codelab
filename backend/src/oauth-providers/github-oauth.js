import axios from 'axios'
import _ from 'lodash'

function getFromGitHub (path, token) {
  return axios({
    method: 'get',
    url: `https://api.github.com${path}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  })
}

export async function requestLoginProfile (code, callback) {
  let loginProfile = {
    provider: 'github'
  }
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
        loginProfile.type = response.data.token_type
        loginProfile.token = response.data.access_token
        loginProfile.scope = response.data.scope

        return Promise.all([
          getFromGitHub('/user/emails', loginProfile.token),
          getFromGitHub('/user', loginProfile.token)
        ])
      }
    })
    .then(([emailResponse, userResponse]) => {
      loginProfile.id = userResponse.data.id
      loginProfile.name = userResponse.data.name
      loginProfile.email = _.find(emailResponse.data, email => { return email.primary }).email
      resolve(loginProfile)
    })
    .catch(error => {
      reject(error)
    })
  })
}
