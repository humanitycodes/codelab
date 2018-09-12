import translateLessonFromRecord from 'translators/lesson/from-record'
import broadcastDataToUser from 'notifications/_helpers/broadcast-data-to-user'

export default async ({ action, lessonRecord, recipientUserRecords }) =>
  Promise.all(
    recipientUserRecords.map(async userRecord => {
      const lesson = action === 'deleted'
        ? lessonRecord
        : await translateLessonFromRecord({
          authUser: userRecord,
          lessonRecord
        })

      return broadcastDataToUser({
        userId: userRecord.userId,
        data: {
          action,
          resourceType: 'lesson',
          resource: lesson
        }
      })
    })
  )
