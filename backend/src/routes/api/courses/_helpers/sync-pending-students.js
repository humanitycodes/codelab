import readCourseStudentPendingRecordsForCourseId from 'db/course/student-pending/read-for-course-id'
import createPendingStudentRecord from 'db/course/student-pending/create'
import deletePendingStudentRecord from 'db/course/student-pending/delete'

export default async ({ courseRecord, updatedCourse, transaction }) => {
  const pendingStudentRecords =
    await readCourseStudentPendingRecordsForCourseId(
      courseRecord.courseId, { transaction }
    )

  // Create pending students that don't already have a relationship
  const toCreate = updatedCourse.pendingStudentEmails.filter(
    email => !pendingStudentRecords.some(
      courseStudentPendingRecord => courseStudentPendingRecord.email === email
    )
  ).map(email => ({ courseId: courseRecord.courseId, email }))

  // Delete relationships that don't exist in the updated course
  const toDelete = pendingStudentRecords.filter(
    courseStudentPendingRecord => !updatedCourse.pendingStudentEmails.some(
      email => email === courseStudentPendingRecord.email
    )
  )

  // Perform any needed deletes and inserts in tandem
  return Promise.all([
    toDelete.map(async courseStudentPendingRecord => {
      await deletePendingStudentRecord(
        courseStudentPendingRecord, { transaction }
      )
    }),
    toCreate.map(async pendingStudent => {
      await createPendingStudentRecord(pendingStudent, { transaction })
    })
  ])
}
