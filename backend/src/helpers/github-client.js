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
  }).then(response => response.data)
}

function postToGitHub (path, token, body) {
  return axios({
    method: 'post',
    url: `${config.githubAuthBaseURL}${path}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    },
    data: body
  }).then(response => response.data)
}

export function getUserProfile (token) {
  return getFromGitHub('/user', token)
}

export function createRepository (token, { name }) {
  return postToGitHub('/user/repos', token, { name: name })
}
