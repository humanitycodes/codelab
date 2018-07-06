import joi from 'joi'
import boom from 'boom'
import deleteGitHubRepository from '../../services/github/delete-repository'
import { readUserById } from '../../db/user-repo'
import repoName from '../../helpers/repo-name'
import {
  readProjectCompletion,
  deleteProjectCompletion
} from '../../db/project-completion-repo'

export default [
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
    async handler (request, reply) {
      try {
        const uid = request.auth.credentials.user_id
        const user = (await readUserById(uid))[1]
        if (!user) {
          throw boom.forbidden(`User ${uid} not found.`)
        } else if (!user.github) {
          throw boom.forbidden(`User ${uid} has not connected their GitHub account.`)
        }

        const { courseKey, projectCompletionKey } = request.params
        const projectCompletion = await readProjectCompletion({ courseKey, projectCompletionKey })

        const repo = repoName(courseKey, projectCompletion.lessonKey, projectCompletion.projectKey)
        const ownerAndRepo = {
          owner: user.github.login,
          repo
        }

        try {
          await deleteGitHubRepository(user.github.token, ownerAndRepo)
        } catch (notfound) {
          console.warn(
            'Unable to delete GitHub repository:',
            ownerAndRepo,
            '. Reason:',
            notfound
          )
        }

        await deleteProjectCompletion({ courseKey, projectCompletionKey })

        reply()
      } catch (error) {
        const params = JSON.stringify(request.payload)
        console.error(`Unable to delete project completion with parameters ${params}. Reason:`, error)
        reply(boom.wrap(error))
      }
    }
  }
]
