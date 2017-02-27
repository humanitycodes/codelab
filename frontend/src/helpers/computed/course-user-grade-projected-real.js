import courseUserGradeCurrentReal from './course-user-grade-current-real'
import coursePercentThrough from './course-percent-through'

export default (course, user) => {
  const currentGrade = courseUserGradeCurrentReal(course, user)
  const percentThroughCourse = coursePercentThrough(course)

  if (currentGrade === 0 || percentThroughCourse === 0) {
    return 0
  }

  return currentGrade / (percentThroughCourse / 100)
}
