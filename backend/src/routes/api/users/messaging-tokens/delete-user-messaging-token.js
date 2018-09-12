import boom from 'boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import HttpStatus from 'http-status'
import readUserMessagingTokenRecordById from 'db/user/messaging-token/read-by-id'
import deleteUserMessagingTokenRecord from 'db/user/messaging-token/delete'

export default {
  method: 'DELETE',
  path: '/users/{userId}/messaging-tokens/{userMessagingTokenId}',
  options: {
    validate: {
      params: joi.object({
        userId: joi.number().integer().required(),
        userMessagingTokenId: joi.number().integer().required()
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    const userId = request.params.userId
    const userMessagingTokenId = request.params.userMessagingTokenId
    let transaction

    try {
      // Users can only add tokens to their own accounts
      if (authUser.userId !== userId) {
        return boom.notFound()
      }

      transaction = await sequelize.transaction()

      // Attempt to find an existing token
      const userMessagingTokenRecord = await readUserMessagingTokenRecordById(
        userMessagingTokenId, { transaction }
      )

      // Delete the token if it exists
      if (userMessagingTokenRecord) {
        await deleteUserMessagingTokenRecord(
          userMessagingTokenRecord, { transaction }
        )
      }
      await transaction.commit()

      return h.response().code(HttpStatus.NO_CONTENT)
    } catch (error) {
      console.error(
        `Unable to delete messaging token ${userMessagingTokenId}`,
        `on user ${userId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.wrap(error)
    }
  }
}
