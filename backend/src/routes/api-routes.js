import joi from 'joi'
import boom from 'boom'

import { config as env } from '../../env/config'
const ghclient = require('../helpers/github-client')
const userRepo = require('../db/user-repo')
const projectCompletionRepo = require('../db/project-completion-repo')

export const config = [
  {
    method: 'GET',
    path: `/authenticated`,
    config: {
      auth: {
        // https://github.com/dwyl/hapi-auth-jwt2#authentication-modes
        mode: 'try',
        strategy: 'jwt'
      }
    },
    handler: (request, reply) => {
      reply({ authenticated: request.auth.isAuthenticated })
    }
  },
  {
    method: 'POST',
    path: `/project-completions`,
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
        const user = (yield userRepo.readById(uid))[1]
        if (!user) {
          throw boom.forbidden(`User ${uid} not found.`)
        } else if (!user.github) {
          throw boom.forbidden(`User ${uid} has not connected their GitHub account.`)
        }

        const { courseKey, lessonKey, projectKey } = request.payload
        const repoName = `${courseKey}-${lessonKey}-${projectKey.slice(-6)}`
        yield ghclient.createRepository(user.github.token, { name: repoName })
        yield ghclient.createWebhooks(user.github.token, {
          owner: user.github.login,
          repo: repoName
        })
        yield projectCompletionRepo.create({ uid, courseKey, lessonKey, projectKey })

        reply({ repo: { name: repoName } })
      } catch (error) {
        const params = JSON.stringify(request.payload)
        console.error(`Unable to create project submission with parameters ${params}. Reason:`, error)
        reply(boom.wrap(error))
      }
    }
  },
  {
    method: 'POST',
    path: env.githubEventsPath,
    config: {
      validate: {
        headers: joi.object({
          'x-github-event': joi.string().required(),
          'x-github-delivery': joi.string().required()
        }).required()
      }
    },
    handler: function* (request, reply) {
      const eventId = request.headers['X-GitHub-Delivery']

      try {
        const eventName = request.headers['X-GitHub-Event']
        console.log(`Received GitHub ${eventName} event ${eventId}. Payload:`,
          JSON.stringify(request.payload))
        reply()
      } catch (error) {
        console.error(`Unable to process GitHub event ${eventId}. Reason:`, error)
        reply(boom.wrap(error))
      }
    }
  }
]
