export default async (courseRecord, userId) => {
  const instructors = await courseRecord.getInstructors()
  return instructors.some(
    courseInstructorRecord => courseInstructorRecord.userId === userId
  )
}
