import boom from '@hapi/boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import readUserRecordById from 'db/user/read-by-id'
import refreshUserRecord from 'db/user/refresh'
import updateUserRecord from 'db/user/update'
import translateUserFromRecord from 'translators/user/from-record'
import signJsonWebToken from 'helpers/jwt/sign-json-web-token'

export default {
  method: 'PUT',
  path: '/users/{userId}',
  options: {
    validate: {
      params: joi.object({
        userId: joi.number().integer().required()
      }).required(),
      payload: joi.object({
        userId: joi.number().integer().required(),
        fullName: joi.string().optional(),
        version: joi.number().integer().allow(null)
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    const userId = request.params.userId
    let transaction

    try {
      // Users can only update their own record
      if (authUser.userId !== userId) {
        return boom.notFound()
      }

      transaction = await sequelize.transaction()
      const userRecord = await readUserRecordById(userId, { transaction })

      if (!userRecord) {
        throw boom.notFound()
      }

      const partialUpdatedUser = request.payload

      // Unique identifiers and version cannot be changed by clients
      if (partialUpdatedUser.version !== userRecord.version) {
        throw boom.conflict('user.update.version.mismatch')
      } else if (partialUpdatedUser.lessonId !== userRecord.lessonId) {
        throw boom.conflict('user.update.userId.mismatch')
      }

      let changed = false

      // Set updated fields on lesson record
      if (
        partialUpdatedUser.fullName &&
        userRecord.fullName !== partialUpdatedUser.fullName
      ) {
        userRecord.fullName = partialUpdatedUser.fullName
        changed = true
      }

      // Update, refresh, and send the user to the client
      if (changed) {
        await updateUserRecord(userRecord, { transaction })
        await refreshUserRecord(userRecord, { transaction })
      }

      const user = await translateUserFromRecord({ authUser, userRecord })
      await transaction.commit()

      if (changed) {
        // Set x-token-refresh on the _request_ so the refresh-token-on-response
        // interceptor will send the latest version of the token instead of the
        // token used to authenticate this request.
        request.headers['x-token-refresh'] = signJsonWebToken({ user })
      }

      return user
    } catch (error) {
      console.error(
        `Unable to update user ${userId}`,
        `with user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.boomify(error)
    }
  }
}
