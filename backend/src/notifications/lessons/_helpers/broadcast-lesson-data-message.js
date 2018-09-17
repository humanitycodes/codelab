import translateLessonFromRecord from 'translators/lesson/from-record'
import broadcastDataToUser from 'notifications/_helpers/broadcast-data-to-user'
import isObjectTooBigToBroadcast from 'notifications/_helpers/is-object-too-big-to-broadcast'

export default async ({ action, lessonRecord, recipientUserRecords }) =>
  Promise.all(
    recipientUserRecords.map(async userRecord => {
      const lesson = action === 'deleted'
        ? lessonRecord
        : await translateLessonFromRecord({
          authUser: userRecord,
          lessonRecord
        })

      const data = { action, resourceType: 'lesson' }
      if (isObjectTooBigToBroadcast(lesson)) {
        data.resourceId = lesson.lessonId
      } else {
        data.resource = lesson
      }

      return broadcastDataToUser({
        userId: userRecord.userId,
        data
      })
    })
  )
