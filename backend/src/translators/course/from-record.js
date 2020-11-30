import dateToTimestamp from '../_helpers/date-to-timestamp'

export default async ({ authUser, courseRecord, transaction }) => {
  // Whitelist of fields that are available to clients
  const course = {
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
  const instructors = await courseRecord.getInstructors({
    attributes: ['userId'], transaction
  })
  course.instructorIds = instructors.map(userRecord => userRecord.userId)

  // Translate a student (ID only) if the requester instructs the course
  // or the requester is the student being translated
  const isInstructorInCourse = course.instructorIds.includes(authUser.userId)
  const students = await courseRecord.getStudents({
    attributes: ['userId'], transaction
  })
  students.forEach(userRecord => {
    if (isInstructorInCourse || userRecord.userId === authUser.userId) {
      course.studentIds.push(userRecord.userId)
    }
  })

  // Translate lessons (IDs only)
  const lessons = await courseRecord.getLessons({
    attributes: ['lessonId'], transaction
  })
  course.lessonIds = lessons.map(lessonRecord => lessonRecord.lessonId)

  // Translate pending students (emails only)
  const pendingStudents = await courseRecord.getPendingStudents({
    attributes: ['email'], transaction
  })
  course.pendingStudentEmails = pendingStudents.map(
    courseStudentPendingRecord => courseStudentPendingRecord.email
  )

  return course
}
