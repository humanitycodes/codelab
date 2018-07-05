export default (courseRecord, userId) => courseRecord.instructors.some(
  courseInstructorRecord => courseInstructorRecord.userId === userId
)
