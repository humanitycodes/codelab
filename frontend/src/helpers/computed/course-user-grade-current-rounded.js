import courseUserGradeCurrentReal from './course-user-grade-current-real'
import getGradeRounded from '../utils/get-grade-rounded'

export default (course, user) => {
  const realGrade = courseUserGradeCurrentReal(course, user)
  return getGradeRounded(realGrade)
}
