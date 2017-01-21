import joi from 'joi'
import boom from 'boom'

import * as ghclient from '../../helpers/github-client'
import { readUserById } from '../../db/user-repo'
import { createProjectCompletion } from '../../db/project-completion-repo'

export default {
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
      const user = (yield readUserById(uid))[1]
      if (!user) {
        throw boom.forbidden(`User ${uid} not found.`)
      } else if (!user.github) {
        throw boom.forbidden(`User ${uid} has not connected their GitHub account.`)
      }

      const { courseKey, lessonKey, projectKey } = request.payload
      const repoName = `${courseKey}-${lessonKey}-${projectKey.slice(-6)}`
      const ownerAndRepo = {
        owner: user.github.login,
        repo: repoName
      }

      try {
        yield ghclient.getRepository(user.github.token, ownerAndRepo)
      } catch (notfound) {
        yield ghclient.createRepository(user.github.token, { name: repoName })
      }

      yield ghclient.createWebhooks(user.github.token, ownerAndRepo)
      yield createProjectCompletion({ uid, courseKey, lessonKey, projectKey })

      reply({ repo: { name: repoName } })
    } catch (error) {
      const params = JSON.stringify(request.payload)
      console.error(`Unable to create project completion with parameters ${params}. Reason:`, error)
      reply(boom.wrap(error))
    }
  }
}
