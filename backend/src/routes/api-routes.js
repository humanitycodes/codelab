import joi from 'joi'
import boom from 'boom'

const ghclient = require('../helpers/github-client')
const userRepo = require('../db/user-repo')

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
    path: `/project-submissions`,
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
        const user = yield userRepo.readById(uid)[1]
        if (!user) {
          throw boom.forbidden(`User ${uid} not found.`)
        } else if (!user.github) {
          throw boom.forbidden(`User ${uid} has not connected their GitHub account.`)
        }

        const { courseKey, lessonKey, projectKey } = request.payload
        const repoName = `${courseKey}-${lessonKey}-${projectKey.slice(-6)}`
        const repo = yield ghclient.createRepository(user.github.token, { name: repoName })

        reply({
          repo: {
            name: repoName,
            htmlUrl: repo.html_url,
            apiUrl: repo.url
          }
        })
      } catch (error) {
        reply(boom.wrap(error))
      }
    }
  }
]
