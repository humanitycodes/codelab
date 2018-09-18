import translateCourseFromRecord from 'translators/course/from-record'
import broadcastDataToUser from 'notifications/_helpers/broadcast-data-to-user'
import isStringTooBigToBroadcast from 'notifications/_helpers/is-string-too-big-to-broadcast'

export default async ({ action, courseRecord, recipientUserRecords }) =>
  Promise.all(
    recipientUserRecords.map(async userRecord => {
      const course = action === 'deleted'
        ? courseRecord
        : await translateCourseFromRecord({
          authUser: userRecord,
          courseRecord
        })

      const data = { action, resourceType: 'course' }
      const courseJson = JSON.stringify(course)
      if (isStringTooBigToBroadcast(courseJson)) {
        data.resourceId = course.courseId.toString()
      } else {
        data.resource = courseJson
      }

      return broadcastDataToUser({
        userId: userRecord.userId,
        data
      })
    })
  )
