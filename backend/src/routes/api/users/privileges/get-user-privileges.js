import boom from 'boom'
import joi from 'joi'
import getGitHubUserProfile from '../../../../services/github/get-user-profile'

export default {
  method: 'GET',
  path: '/users/{userId}/privileges',
  options: {
    validate: {
      params: joi.object({
        userId: joi.number().integer().required()
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    const userId = request.params.userId
    const privileges = {
      createPrivateRepo: false
    }

    try {
      if (userId !== authUser.userId) {
        throw boom.forbidden('userPrivileges.get.userId.mismatch')
      }

      if (authUser.githubToken) {
        const githubProfile = await getGitHubUserProfile(authUser.githubToken)
        privileges.createPrivateRepo = githubProfile.plan.private_repos > 0
      }

      return privileges
    } catch (error) {
      console.error(
        `Unable to get privileges for user ${userId}`,
        `as user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.wrap(error)
    }
  }
}
