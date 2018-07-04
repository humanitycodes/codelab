export default ({ payload }) => {
  // Whitelist fields that will be translated
  const course = {
    courseId: payload.courseId,
    courseKey: payload.courseKey,
    credits: payload.credits,
    startDate: payload.startDate,
    endDate: payload.endDate,
    syllabus: payload.syllabus,
    title: payload.title,
    version: payload.version,
    instructorIds: [],
    studentIds: [],
    lessonIds: []
  }

  // Translate instructors
  if (payload.instructorIds) {
    course.instructorIds = payload.instructorIds.map(userId => userId)
  }

  // Translate students
  if (payload.studentIds) {
    course.studentIds = payload.studentIds.map(userId => userId)
  }

  // Translate lessons
  if (payload.lessonIds) {
    course.lessonIds = payload.lessonIds.map(lessonId => lessonId)
  }

  return course
}
