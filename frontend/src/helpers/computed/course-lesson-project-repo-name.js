export default (course, lesson) => {
  const courseParts = course.courseKey.split('-')
  return `${courseParts[0]}-${courseParts[1]}-${lesson.lessonKey}`
}
