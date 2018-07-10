import createUserRecord from 'db/user/create'
import readCourseRecordById from 'db/course/read-by-id'
import readPendingStudentRecordsForEmail from 'db/course/student-pending/read-all-for-email'
import deletePendingStudentRecord from 'db/course/student-pending/delete'

export default async ({ email, fullName, msuUid }, { transaction }) => {
  // Create the user record
  const userRecord = await createUserRecord(
    { email, fullName, msuUid }, { transaction }
  )

  // Enroll user in courses (if any)
  const pendingStudentRecords = await readPendingStudentRecordsForEmail(
    email, { transaction }
  )
  await Promise.all(
    pendingStudentRecords.map(async pendingStudentRecord => {
      const courseRecord = await readCourseRecordById(
        pendingStudentRecord.courseId, { transaction }
      )
      await courseRecord.addStudent(userRecord, { transaction })
      await deletePendingStudentRecord(
        pendingStudentRecord, { transaction }
      )
    })
  )

  return userRecord
}
