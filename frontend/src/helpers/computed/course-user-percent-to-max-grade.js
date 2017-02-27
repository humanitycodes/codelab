import courseUserGradeCurrentReal from './course-user-grade-current-real'
import getPercentOfMaxGrade from '../utils/get-percent-of-max-grade'

export default (course, user) => {
  const realGrade = courseUserGradeCurrentReal(course, user)
  return getPercentOfMaxGrade(realGrade)
}
