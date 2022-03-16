import boom from '@hapi/boom'
import joi from 'joi'
import sequelize from 'db/sequelize'
import canCreateUser from 'helpers/permission/can-create-user'
import createUserRecord from 'db/user/create'
import readUserRecordByEmail from 'db/user/read-by-email'
import refreshUserRecord from 'db/user/refresh'
import translateUserFromRecord from 'translators/user/from-record'
import translateUserFromPayload from 'translators/user/from-payload'

export default {
  method: 'POST',
  path: '/users',
  options: {
    validate: {
      payload: joi.object({
        email: joi.string().min(5).required(),
        fullName: joi.string().min(1).required(),
        isInstructor: joi.boolean().default(false)
      }).required()
    }
  },
  async handler (request, h) {
    const authUser = request.auth.credentials.user
    let transaction
    try {
      if (!canCreateUser(authUser)) {
        return boom.forbidden()
      }

      transaction = await sequelize.transaction()

      // Make sure the email address is not already in use
      const existingUserRecord = await readUserRecordByEmail(
        request.payload.email, { transaction }
      )
      if (existingUserRecord) {
        throw boom.badData('user.create.email.exists')
      }

      // Create the new user
      const newUser = translateUserFromPayload({ payload: request.payload })
      const userRecord = await createUserRecord(newUser, { transaction })

      // Send the newly created user to the client
      await refreshUserRecord(userRecord, { transaction })
      const user = await translateUserFromRecord({ userRecord, transaction })
      await transaction.commit()
      return user
    } catch (error) {
      console.error(
        'Unable to create user',
        `for user ${authUser.userId} (${authUser.fullName}).`,
        'Reason:', error
      )
      await transaction.rollback()
      return boom.boomify(error)
    }
  }
}
