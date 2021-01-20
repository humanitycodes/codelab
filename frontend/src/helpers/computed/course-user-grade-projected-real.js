import coursePercentThrough from './course-percent-through'

export default (course, currentGrade) => {
  const percentThroughCourse = coursePercentThrough(course)
  return (currentGrade === 0 || percentThroughCourse === 0)
    ? 0
    : currentGrade / (percentThroughCourse / 100)
}
