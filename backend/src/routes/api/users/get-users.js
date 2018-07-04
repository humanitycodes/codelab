import boom from 'boom'
import canReadAllUsers from '../../../helpers/permission/can-read-all-users'
import readAllUsers from '../../../db/user/read-all'
import translateUserFromRecord from '../../../translators/user/from-record'

export default {
  method: 'GET',
  path: '/users',
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    try {
      if (!canReadAllUsers(authUser)) {
        return boom.forbidden()
      }

      const userRecords = readAllUsers()
      const users = userRecords.map(userRecord =>
        translateUserFromRecord({ authUser, userRecord })
      )

      return users
    } catch (error) {
      console.error(
        `Unable to get users for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      return boom.wrap(error)
    }
  }
}
