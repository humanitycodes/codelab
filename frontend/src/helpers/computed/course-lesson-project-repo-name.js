export default (course, lesson) => {
  return [
    course.courseKey,
    lesson.lessonKey,
    lesson.projectKey.slice(-6)
  ].join('-')
}
