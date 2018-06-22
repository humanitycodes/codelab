import boom from 'boom'
import { readUserById } from '../../db/user-repo'
import getGitHubUserProfile from '../../services/github/get-user-profile'

export default {
  method: 'GET',
  path: '/privileges',
  config: {
    auth: {
      mode: 'required',
      strategy: 'jwt'
    }
  },
  handler: function* (request, reply) {
    const uid = request.auth.credentials.user_id
    let privileges = {
      createPrivateRepo: false
    }

    try {
      const user = (yield readUserById(uid))[1]
      if (!user) {
        throw boom.forbidden(`User ${uid} not found.`)
      }

      if (user.github) {
        const githubProfile = yield getGitHubUserProfile(user.github.token)
        privileges.createPrivateRepo = githubProfile.plan.private_repos > 0
      }

      reply(privileges)
    } catch (error) {
      console.error(`Unable to get privileges for user ${uid}. Reason:`, error)
      reply(boom.wrap(error))
    }
  }
}
