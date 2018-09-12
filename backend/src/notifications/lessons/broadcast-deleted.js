import broadcastLessonDataMessage from './_helpers/broadcast-lesson-data-message'

export default async ({ lessonRecord, recipientUserRecords }) =>
  broadcastLessonDataMessage({
    action: 'deleted',
    lessonRecord,
    recipientUserRecords
  })
