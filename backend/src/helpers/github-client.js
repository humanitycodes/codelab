import axios from 'axios'
import { config } from '../../env/config'

function getFromGitHub (path, token) {
  return axios({
    method: 'get',
    url: `${config.githubAuthBaseURL}${path}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  })
}

export function getUserProfile ({ token }) {
  return getFromGitHub('/user', token)
}
