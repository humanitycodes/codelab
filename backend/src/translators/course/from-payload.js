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
    version: payload.version
  }

  return course
}
