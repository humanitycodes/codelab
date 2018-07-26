export default async (courseRecord, options) => {
  // Delete foreign keys first
  const instructors = await courseRecord.getInstructors(options)
  if (instructors.length) {
    await courseRecord.removeInstructors(instructors, options)
  }

  const students = await courseRecord.getStudents(options)
  if (students.length) {
    await courseRecord.removeStudents(students, options)
  }

  const lessons = await courseRecord.getLessons(options)
  if (lessons.length) {
    await courseRecord.removeLessons(lessons, options)
  }

  const pendingStudents = await courseRecord.getPendingStudents(options)
  if (pendingStudents.length) {
    await courseRecord.removePendingStudents(pendingStudents, options)
  }

  await courseRecord.destroy(options)
}
