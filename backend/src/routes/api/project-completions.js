import joi from 'joi'
import boom from 'boom'

import acceptGitHubInvitation from '../../services/github/accept-invitation'
import createGitHubRepository from '../../services/github/create-repository'
import createGitHubWebhooks from '../../services/github/create-webhooks'
import deleteGitHubRepository from '../../services/github/delete-repository'
import getGitHubRepository from '../../services/github/get-repository'
import getGitHubRepositoryInvitations from '../../services/github/get-repository-invitations'
import inviteGitHubCollaborator from '../../services/github/invite-collaborator'

import { readUserById } from '../../db/user-repo'
import repoName from '../../helpers/repo-name'
import {
  createProjectCompletion,
  readProjectCompletion,
  deleteProjectCompletion
} from '../../db/project-completion-repo'
import { readInstructorsByCourseKey } from '../../db/instructor-repo'

function* getOrCreateRepository (githubToken, { owner, repo }) {
  try {
    return yield getGitHubRepository(githubToken, { owner, repo })
  } catch (notfound) {
    return yield createGitHubRepository(githubToken, { name: repo })
  }
}

function inviteCollaborators (githubToken, { owner, repo, invitees }) {
  const invitationRequests = invitees.map(invitee => {
    return inviteGitHubCollaborator(githubToken, { owner, repo, invitee })
  })
  return Promise.all(invitationRequests)
}

function acceptInvitations ({ invitations, inviteeTokens }) {
  let acceptanceRequests = []
  invitations.forEach(invitation => {
    const inviteeToken = inviteeTokens[invitation.invitee.login]
    const invitationId = invitation.id
    if (!inviteeToken || !invitationId) return
    acceptanceRequests.push(acceptGitHubInvitation(inviteeToken, { invitationId }))
  })
  return Promise.all(acceptanceRequests)
}

function getInstructorGitHubLogins (instructors) {
  // Example return value: ['elgillespie', 'KatieMFritz']
  let instructorLogins = []
  Object.keys(instructors).forEach(instructorKey => {
    const instructor = instructors[instructorKey]
    if (!instructor.github) return
    instructorLogins.push(instructor.github.login)
  })
  return instructorLogins
}

function mapInstructorKeysToGitHubAccessTokens (instructors) {
  // Example return value: { elgillespie: 1234 }
  return Object.keys(instructors).reduce((loginTokens, instructorKey) => {
    const githubInfo = instructors[instructorKey].github
    if (githubInfo) {
      loginTokens[githubInfo.login] = githubInfo.token
    }
    return loginTokens
  }, {})
}

function* addInstructorsAsCollaborators (githubToken, { courseKey, owner, repo }) {
  const instructors = yield readInstructorsByCourseKey(courseKey)
  const invitees = getInstructorGitHubLogins(instructors)
  const inviteeTokens = mapInstructorKeysToGitHubAccessTokens(instructors)

  yield inviteCollaborators(githubToken, { owner, repo, invitees })
  .then(() => {
    return getGitHubRepositoryInvitations(githubToken, { owner, repo })
  })
  .then(invitations => {
    return acceptInvitations({ invitations, inviteeTokens })
  })
  .catch(error => {
    console.error(
      'Unable to invite instructors as collaborators with parameters:',
      { courseKey, owner, repo, invitees },
      '. Reason:',
      error)
  })
}

export default [
  {
    method: 'POST',
    path: '/project-completions',
    config: {
      auth: {
        mode: 'required',
        strategy: 'jwt'
      },
      validate: {
        payload: joi.object({
          courseKey: joi.string().required(),
          lessonKey: joi.string().required(),
          projectKey: joi.string().required()
        }).required()
      }
    },
    handler: function* (request, reply) {
      try {
        const uid = request.auth.credentials.user_id
        const user = (yield readUserById(uid))[1]
        if (!user) {
          throw boom.forbidden(`User ${uid} not found.`)
        } else if (!user.github) {
          throw boom.forbidden(`User ${uid} has not connected their GitHub account.`)
        }

        const { courseKey, lessonKey, projectKey } = request.payload
        const repo = repoName(courseKey, lessonKey, projectKey)
        const owner = user.github.login

        const repository = yield getOrCreateRepository(user.github.token, { owner, repo })
        yield addInstructorsAsCollaborators(user.github.token, { courseKey, owner, repo })

        let projectCompletion = { uid, courseKey, lessonKey, projectKey }
        projectCompletion.repositoryCreatedAt = new Date(repository.created_at).getTime()

        yield createGitHubWebhooks(user.github.token, { owner, repo })
        yield createProjectCompletion(projectCompletion)

        reply({ repo: { name: repo } })
      } catch (error) {
        const params = JSON.stringify(request.payload)
        console.error(`Unable to create project completion with parameters ${params}. Reason:`, error)
        reply(boom.wrap(error))
      }
    }
  },
  {
    method: 'DELETE',
    path: '/project-completions/{courseKey}/{projectCompletionKey}',
    config: {
      auth: {
        mode: 'required',
        strategy: 'jwt'
      },
      validate: {
        params: joi.object({
          courseKey: joi.string().required(),
          projectCompletionKey: joi.string().required()
        }).required()
      }
    },
    handler: function* (request, reply) {
      try {
        const uid = request.auth.credentials.user_id
        const user = (yield readUserById(uid))[1]
        if (!user) {
          throw boom.forbidden(`User ${uid} not found.`)
        } else if (!user.github) {
          throw boom.forbidden(`User ${uid} has not connected their GitHub account.`)
        }

        const { courseKey, projectCompletionKey } = request.params
        const projectCompletion = yield readProjectCompletion({ courseKey, projectCompletionKey })

        const repo = repoName(courseKey, projectCompletion.lessonKey, projectCompletion.projectKey)
        const ownerAndRepo = {
          owner: user.github.login,
          repo
        }

        try {
          yield deleteGitHubRepository(user.github.token, ownerAndRepo)
        } catch (notfound) {
          console.warn(
            'Unable to delete GitHub repository:',
            ownerAndRepo,
            '. Reason:',
            notfound
          )
        }

        yield deleteProjectCompletion({ courseKey, projectCompletionKey })

        reply()
      } catch (error) {
        const params = JSON.stringify(request.payload)
        console.error(`Unable to delete project completion with parameters ${params}. Reason:`, error)
        reply(boom.wrap(error))
      }
    }
  }
]
