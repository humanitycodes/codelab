import axios from 'axios'
import { config } from '../../env/config'
import githubEventHandlers from './github-event-handlers'

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

export function getRepository (token, { owner, repo }) {
  return getFromGitHub(`/repos/${owner}/${repo}`, token)
}

export function createWebhooks (token, { owner, repo }) {
  let failureCount = 0

  const attemptToCreateWebhooks = (resolve, reject) => {
    return postToGitHub(`/repos/${owner}/${repo}/hooks`, token, {
      name: 'web',
      active: true,
      events: Object.keys(githubEventHandlers),
      config: {
        url: `${config.githubEventsBaseURL}${config.githubEventsPath}`,
        content_type: 'json'
      }
    })
    .then(resolve)
    .catch(error => {
      failureCount++
      if (failureCount > 20) {
        reject(error)
      } else {
        setTimeout(() => {
          return attemptToCreateWebhooks(resolve, reject)
        }, 500)
      }
    })
  }

  return new Promise((resolve, reject) => {
    return attemptToCreateWebhooks(resolve, reject)
  })
}
