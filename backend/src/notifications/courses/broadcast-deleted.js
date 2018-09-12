import broadcastCourseDataMessage from './_helpers/broadcast-course-data-message'

export default async ({ courseRecord, recipientUserRecords }) =>
  broadcastCourseDataMessage({
    action: 'deleted',
    courseRecord,
    recipientUserRecords
  })
