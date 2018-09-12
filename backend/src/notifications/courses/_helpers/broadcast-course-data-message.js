import translateCourseFromRecord from 'translators/course/from-record'
import broadcastDataToUser from 'notifications/_helpers/broadcast-data-to-user'

export default async ({ action, courseRecord, recipientUserRecords }) =>
  Promise.all(
    recipientUserRecords.map(async userRecord => {
      const course = action === 'deleted'
        ? courseRecord
        : await translateCourseFromRecord({
          authUser: userRecord,
          courseRecord
        })

      return broadcastDataToUser({
        userId: userRecord.userId,
        data: {
          action,
          resourceType: 'course',
          resource: course
        }
      })
    })
  )
