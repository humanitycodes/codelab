import boom from 'boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import HttpStatus from 'http-status'
import readUserRecordById from 'db/user/read-by-id'
import updateUserRecord from 'db/user/update'
import refreshTokenOnRequest from 'routes/_helpers/refresh-token-on-request'

export default {
  method: 'PUT',
  path: '/users/{userId}/messagingToken',
  options: {
    validate: {
      params: joi.object({
        userId: joi.number().integer().required()
      }).required(),
      payload: joi.object({
        messagingToken: joi.string().allow(null)
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    const userId = request.params.userId
    let transaction

    try {
      // Do not allow unauthorized users to know the project completion exists
      if (authUser.userId !== userId) {
        return boom.notFound()
      }

      transaction = await sequelize.transaction()
      const userRecord = await readUserRecordById(userId, { transaction })

      // Set the new messaging token
      userRecord.messagingToken = request.payload.messagingToken

      // Update the project completion and redirect to the latest version
      await updateUserRecord(userRecord, { transaction })
      await transaction.commit()

      // Set the latest user on the request so the requester gets it
      await refreshTokenOnRequest.method(request, h)

      return h.response().code(HttpStatus.NO_CONTENT)
    } catch (error) {
      console.error(
        'Unable to update messaging token',
        `on user ${userId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
