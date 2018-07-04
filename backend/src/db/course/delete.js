export default async (courseRecord, options) => {
  // Delete foreign keys first
  const removeRelationships = []
  if (courseRecord.instructors) {
    removeRelationships.push(
      courseRecord.removeInstructors(courseRecord.instructors)
    )
  }
  if (courseRecord.students) {
    removeRelationships.push(
      courseRecord.removeStudents(courseRecord.students)
    )
  }
  if (courseRecord.lessons) {
    removeRelationships.push(
      courseRecord.removeLessons(courseRecord.lessons)
    )
  }

  return Promise.all(removeRelationships)
    .then(() => courseRecord.destroy(options))
}
