export default ({ authUser, courseRecord }) => {
  // Whitelist of fields that are available to clients
  let course = {
    courseId: courseRecord.courseId,
    courseKey: courseRecord.courseKey,
    credits: courseRecord.credits,
    startDate: courseRecord.startDate ? courseRecord.startDate.getTime() : null,
    endDate: courseRecord.endDate ? courseRecord.endDate.getTime() : null,
    syllabus: courseRecord.syllabus,
    title: courseRecord.title,
    version: courseRecord.version,
    instructorIds: [],
    studentIds: [],
    lessonIds: []
  }

  // Translate instructors (IDs only)
  if (courseRecord.instructors) {
    course.instructorIds = courseRecord.instructors.map(
      userRecord => userRecord.userId
    )
  }

  // Translate students (IDs only) if the requester instructs the course
  if (
    courseRecord.students &&
    courseRecord.instructors &&
    courseRecord.instructors.some(
      instructor => authUser.userId === instructor.userId
    )
  ) {
    course.studentIds = courseRecord.students.map(
      userRecord => userRecord.userId
    )
  }

  // Translate lessons (IDs only)
  if (courseRecord.lessons) {
    course.lessonIds = courseRecord.lessons.map(
      lessonRecord => lessonRecord.lessonId
    )
  }

  return course
}
