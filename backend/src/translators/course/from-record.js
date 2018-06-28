import translateUserFromRecord from '../user/from-record'

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
    instructors: [],
    lessonIds: []
  }

  // Translate instructors
  if (courseRecord.instructors) {
    course.instructors = courseRecord.instructors.map(
      userRecord => translateUserFromRecord({ userRecord })
    )
  }

  // Translate students if the requesting user is an instructor of the course
  if (
    courseRecord.students &&
    courseRecord.instructors &&
    courseRecord.instructors.some(instructor =>
      authUser.userId === instructor.userId
    )
  ) {
    course.students = courseRecord.students.map(
      userRecord => translateUserFromRecord({ userRecord })
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
