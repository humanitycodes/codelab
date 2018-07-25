export default async ({ courseRecord, updatedCourse, transaction }) => {
  const instructorRecords = await courseRecord.getInstructors({ transaction })

  // Create instructors that don't already have a relationship
  const toCreate = updatedCourse.instructorIds.filter(
    instructorId => !instructorRecords.some(
      courseInstructorRecord => courseInstructorRecord.userId === instructorId
    )
  )

  // Delete relationships that don't exist in the updated course
  const toDelete = instructorRecords.filter(
    courseInstructorRecord => !updatedCourse.instructorIds.some(
      instructorId => instructorId === courseInstructorRecord.userId
    )
  ).map(courseInstructorRecord => courseInstructorRecord.userId)

  // Perform any needed deletes and inserts in tandem
  const changes = []
  if (toDelete.length > 0) {
    changes.push(courseRecord.removeInstructors(toDelete, { transaction }))
  }
  if (toCreate.length > 0) {
    changes.push(courseRecord.addInstructors(toCreate, { transaction }))
  }
  return Promise.all(changes)
}
