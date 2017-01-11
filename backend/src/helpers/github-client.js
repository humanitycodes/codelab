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

export function createWebhooks (token, { owner, repo, events }) {
  return new Promise(resolve => {
    setTimeout(resolve, 1000)
  })
  .then(() => {
    return postToGitHub(`/repos/${owner}/${repo}/hooks`, token, {
      name: 'web',
      active: true,
      events: events,
      config: {
        url: `${config.githubEventsBaseURL}${config.githubEventsPath}`,
        content_type: 'json'
      }
    })
  })
}
