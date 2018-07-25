import dateToTimestamp from '../_helpers/date-to-timestamp'
import readCourseStudentPendingRecordsForCourseId from 'db/course/student-pending/read-for-course-id'

export default async ({ authUser, courseRecord, transaction }) => {
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
  // Lazy-loading this relationship uses a bogus query:
  // ``` sql
  //   SELECT "course_id" AS "courseId", "email", "version", "course_id"
  //   FROM "course_student_pending" AS "courseStudentPending"
  //   WHERE "courseStudentPending"."course_id" = NULL;
  // ```
  // So use an explicit query using the courseId to avoid the outer joins
  // that come with eager loading.
  const pendingStudents = await readCourseStudentPendingRecordsForCourseId(
    courseRecord.courseId,
    { attributes: ['email'], transaction }
  )
  course.pendingStudentEmails = pendingStudents.map(
    courseStudentPendingRecord => courseStudentPendingRecord.email
  )

  return course
}
