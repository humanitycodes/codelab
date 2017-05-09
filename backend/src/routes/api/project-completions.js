import joi from 'joi'
import boom from 'boom'

import * as ghclient from '../../helpers/github-client'
import { readUserById } from '../../db/user-repo'
import repoName from '../../helpers/repo-name'
import {
  createProjectCompletion,
  readProjectCompletion,
  deleteProjectCompletion
} from '../../db/project-completion-repo'

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
        const ownerAndRepo = {
          owner: user.github.login,
          repo
        }

        let repository
        try {
          repository = yield ghclient.getRepository(user.github.token, ownerAndRepo)
        } catch (notfound) {
          repository = yield ghclient.createRepository(user.github.token, { name: repo })
        }

        let projectCompletion = { uid, courseKey, lessonKey, projectKey }
        projectCompletion.repositoryCreatedAt = new Date(repository.created_at).getTime()

        yield ghclient.createWebhooks(user.github.token, ownerAndRepo)
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
          yield ghclient.deleteRepository(user.github.token, ownerAndRepo)
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
