import sendMessage from 'notifications/send-message'
import translateCourseFromRecord from 'translators/course/from-record'
import filterUsersWithMessagingToken from 'notifications/_helpers/filter-users-with-messaging-token'

export default async ({ action, courseRecord, recipientUserRecords }) => {
  return Promise.all(
    filterUsersWithMessagingToken(recipientUserRecords)
    .map(async recipientUserRecord => {
      const course = await translateCourseFromRecord({
        authUser: recipientUserRecord,
        courseRecord
      })
      const message = {
        token: recipientUserRecord.messagingToken,
        data: {
          action,
          resourceType: 'course',
          resource: course
        }
      }
      await sendMessage(message)
    })
  )
}
