import sendMessage from 'notifications/send-message'
import readAllUserMessagingTokenRecordsForUserId from 'db/user/messaging-token/read-all-for-user-id'

export default async ({ userId, data }) => {
  const userMessagingTokenRecords =
    await readAllUserMessagingTokenRecordsForUserId(userId)

  return Promise.all(
    userMessagingTokenRecords.map(async userMessagingTokenRecord => {
      const token = userMessagingTokenRecord.messagingToken
      await sendMessage({ token, data })
    })
  )
}
