import courseUserGradeProjectedReal from './course-user-grade-projected-real'
import getGradeReported from '../utils/get-grade-reported'

export default (course, currentGrade) => {
  const realProjectedGrade = courseUserGradeProjectedReal(course, currentGrade)
  return getGradeReported(realProjectedGrade)
}
