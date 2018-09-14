import sequelize from 'db/sequelize'
import deleteAllUserMessagingTokenRecordsForMessagingToken from 'db/user/messaging-token/delete-all-for-messaging-token'

export default async messagingToken => {
  let transaction

  try {
    if (!messagingToken || !messagingToken.trim().length) return

    transaction = await sequelize.transaction()
    await deleteAllUserMessagingTokenRecordsForMessagingToken(
      messagingToken, { transaction }
    )
    await transaction.commit()

    console.log('Removed unused messaging token:', messagingToken)
  } catch (error) {
    await transaction.rollback()
    console.warn('Error deleting unused messaging token:', error)
  }
}
