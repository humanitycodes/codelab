import axios from 'axios'
import { config } from '../../env/config'
import githubEventHandlers from './github-event-handlers'

function deleteFromGitHub (path, token) {
  return axios({
    method: 'delete',
    url: `${config.githubAuthBaseURL}${path}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  })
  .then(response => response.data)
  .catch(error => {
    throw new Error(`DELETE ${path} failed. Reason: ${error}`)
  })
}

function getFromGitHub (path, token) {
  return axios({
    method: 'get',
    url: `${config.githubAuthBaseURL}${path}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  })
  .then(response => response.data)
  .catch(error => {
    throw new Error(`GET ${path} failed. Reason: ${error}`)
  })
}

function patchToGitHub (path, token) {
  return axios({
    method: 'patch',
    url: `${config.githubAuthBaseURL}${path}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  })
  .then(response => response.data)
  .catch(error => {
    throw new Error(`PATCH ${path} failed. Reason: ${error}`)
  })
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
  })
  .then(response => response.data)
  .catch(error => {
    throw new Error(`POST ${path} failed. Reason: ${error}`)
  })
}

function putToGitHub (path, token, body) {
  let headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`
  }
  if (!body) {
    headers['Content-Length'] = 0
  }

  return axios({
    method: 'put',
    url: `${config.githubAuthBaseURL}${path}`,
    headers,
    data: body
  })
  .then(response => response.data)
  .catch(error => {
    throw new Error(`PUT ${path} failed. Reason: ${error}`)
  })
}

export function getUserProfile (token) {
  return getFromGitHub('/user', token)
}

export function createRepository (token, { name }) {
  return postToGitHub('/user/repos', token, { name, private: true })
}

export function getRepository (token, { owner, repo }) {
  return getFromGitHub(`/repos/${owner}/${repo}`, token)
}

export function deleteRepository (token, { owner, repo }) {
  return deleteFromGitHub(`/repos/${owner}/${repo}`, token)
}

export function getCommits (token, { owner, repo }) {
  return getFromGitHub(`/repos/${owner}/${repo}/commits`, token)
}

export function getIssueComments (token, { owner, repo, issueNumber }) {
  return getFromGitHub(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, token)
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

export function inviteCollaborator (token, { owner, repo, invitee }) {
  return putToGitHub(`/repos/${owner}/${repo}/collaborators/${invitee}`, token)
}

export function getRepositoryInvitations (token, { owner, repo }) {
  return getFromGitHub(`/repos/${owner}/${repo}/invitations`, token)
}

export function acceptInvitation (token, { invitationId }) {
  return patchToGitHub(`/user/repository_invitations/${invitationId}`, token)
}
