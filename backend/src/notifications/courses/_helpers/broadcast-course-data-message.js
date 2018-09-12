import sendMessage from 'notifications/send-message'
import translateCourseFromRecord from 'translators/course/from-record'
import readAllUserMessagingTokenRecordsForUserId from 'db/user/messaging-token/read-all-for-user-id'

export default async ({ action, courseRecord, recipientUserRecords }) =>
  Promise.all(
    recipientUserRecords.map(async userRecord => {
      const course = action === 'deleted'
        ? courseRecord
        : await translateCourseFromRecord({
          authUser: userRecord,
          courseRecord
        })

      const userMessagingTokenRecords =
        await readAllUserMessagingTokenRecordsForUserId(userRecord.userId)

      return Promise.all(
        userMessagingTokenRecords.map(async userMessagingTokenRecord => {
          const message = {
            token: userMessagingTokenRecord.messagingToken,
            data: {
              action,
              resourceType: 'course',
              resource: course
            }
          }
          await sendMessage(message)
        })
      )
    })
  )
