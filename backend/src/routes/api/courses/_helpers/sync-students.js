export default async ({ courseRecord, updatedCourse, transaction }) => {
  const studentRecords = await courseRecord.getStudents({ transaction })

  // Create students that don't already have a relationship
  const toCreate = updatedCourse.studentIds.filter(
    studentId => !studentRecords.some(
      courseStudentRecord => courseStudentRecord.userId === studentId
    )
  )

  // Delete relationships that don't exist in the updated course
  const toDelete = studentRecords.filter(
    courseStudentRecord => !updatedCourse.studentIds.some(
      studentId => studentId === courseStudentRecord.userId
    )
  ).map(courseStudentRecord => courseStudentRecord.userId)

  // Perform any needed deletes and inserts in tandem
  const changes = []
  if (toDelete.length > 0) {
    changes.push(courseRecord.removeStudents(toDelete, { transaction }))
  }
  if (toCreate.length > 0) {
    changes.push(courseRecord.addStudents(toCreate, { transaction }))
  }
  return Promise.all(changes)
}
