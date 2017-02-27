import courseUserGradeProjectedReal from './course-user-grade-projected-real'
import getGradeReported from '../utils/get-grade-reported'

export default (course, user) => {
  const realProjectedGrade = courseUserGradeProjectedReal(course, user)
  return getGradeReported(realProjectedGrade)
}
