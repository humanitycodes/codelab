import boom from '@hapi/boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import readAllUserMessagingTokenRecordsForUserId from 'db/user/messaging-token/read-all-for-user-id'
import createUserMessagingTokenRecord from 'db/user/messaging-token/create'
import refreshUserMessagingTokenRecord from 'db/user/messaging-token/refresh'
import translateUserMessagingTokenFromRecord from 'translators/user/messaging-token/from-record'

export default {
  method: 'POST',
  path: '/users/{userId}/messaging-tokens',
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
      // Users can only add tokens to their own accounts
      if (authUser.userId !== userId) {
        return boom.notFound()
      }

      transaction = await sequelize.transaction()

      // Attempt to find an existing token
      const messagingToken = request.payload.messagingToken
      const userMessagingTokenRecords =
        await readAllUserMessagingTokenRecordsForUserId(userId, { transaction })
      let userMessagingTokenRecord = userMessagingTokenRecords.find(
        tokenRecord => tokenRecord.messagingToken === messagingToken
      )

      // Create the token if it doesn't exist
      if (!userMessagingTokenRecord) {
        const userMessagingToken = { userId, messagingToken }
        userMessagingTokenRecord = await createUserMessagingTokenRecord(
          userMessagingToken, { transaction }
        )
        await refreshUserMessagingTokenRecord(
          userMessagingTokenRecord, { transaction }
        )
      }

      const userMessagingToken = translateUserMessagingTokenFromRecord({
        userMessagingTokenRecord
      })
      await transaction.commit()

      return userMessagingToken
    } catch (error) {
      console.error(
        'Unable to create messaging token',
        `on user ${userId}`,
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.boomify(error)
    }
  }
}
