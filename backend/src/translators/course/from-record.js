import dateToTimestamp from '../_helpers/date-to-timestamp'

export default ({ authUser, courseRecord }) => {
  // Whitelist of fields that are available to clients
  let course = {
    courseId: courseRecord.courseId,
    courseKey: courseRecord.courseKey,
    credits: courseRecord.credits,
    startDate: dateToTimestamp(courseRecord.startDate),
    endDate: dateToTimestamp(courseRecord.endDate),
    syllabus: courseRecord.syllabus,
    title: courseRecord.title,
    version: courseRecord.version,
    instructorIds: [],
    studentIds: [],
    lessonIds: [],
    pendingStudentEmails: []
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

  // Translate pending students (emails only)
  if (courseRecord.pendingStudents) {
    course.pendingStudentEmails = courseRecord.pendingStudents.map(
      courseStudentPendingRecord => courseStudentPendingRecord.email
    )
  }

  return course
}
