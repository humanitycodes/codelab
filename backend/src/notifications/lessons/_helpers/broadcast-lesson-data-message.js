import translateLessonFromRecord from 'translators/lesson/from-record'
import broadcastDataToUser from 'notifications/_helpers/broadcast-data-to-user'
import isStringTooBigToBroadcast from 'notifications/_helpers/is-string-too-big-to-broadcast'

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
      const lessonJson = JSON.stringify(lesson)
      if (isStringTooBigToBroadcast(lessonJson)) {
        data.resourceId = lesson.lessonId.toString()
      } else {
        data.resource = lessonJson
      }

      return broadcastDataToUser({
        userId: userRecord.userId,
        data
      })
    })
  )
