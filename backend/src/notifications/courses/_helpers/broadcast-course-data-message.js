import translateCourseFromRecord from 'translators/course/from-record'
import broadcastDataToUser from 'notifications/_helpers/broadcast-data-to-user'
import isObjectTooBigToBroadcast from 'notifications/_helpers/is-object-too-big-to-broadcast'

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
      if (isObjectTooBigToBroadcast(course)) {
        data.resourceId = course.courseId
      } else {
        data.resource = course
      }

      return broadcastDataToUser({
        userId: userRecord.userId,
        data
      })
    })
  )
