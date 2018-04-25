import axios from 'axios'
import { config } from '../../env/config'
import githubEventHandlers from './github-event-handlers'
import retry from 'retry-as-promised'

const MAX_RETRIES = 9

const requestFromGitHub = (method, path, token, body) => {
  let headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`
  }
  if (!body) headers['Content-Length'] = 0

  let params = {
    method,
    headers,
    url: `${config.githubAuthBaseURL}${path}`
  }
  if (body) params.data = body

  // With MAX_RETRIES = 9, backoffBase = 100, backoffExp = 1.1
  // the max duration of a request including all retries is 34,253 ms
  return retry(() => axios(params), MAX_RETRIES)
    .then(response => response.data)
    .catch(error => {
      throw new Error(`${method.toUpperCase()} ${path} failed. Reason:\n${error}`)
    })
}

const deleteFromGitHub = (path, token) => {
  return requestFromGitHub('delete', path, token)
}

const getFromGitHub = (path, token) => {
  return requestFromGitHub('get', path, token)
}

const patchToGitHub = (path, token) => {
  return requestFromGitHub('patch', path, token)
}

const postToGitHub = (path, token, body) => {
  return requestFromGitHub('post', path, token, body)
}

const putToGitHub = (path, token, body) => {
  return requestFromGitHub('put', path, token, body)
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
  return postToGitHub(`/repos/${owner}/${repo}/hooks`, token, {
    name: 'web',
    active: true,
    events: Object.keys(githubEventHandlers),
    config: {
      url: `${config.githubEventsBaseURL}${config.githubEventsPath}`,
      content_type: 'json'
    }
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
