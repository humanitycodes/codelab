import courseUserGradeProjectedReported from './course-user-grade-projected-reported'
import getPercentOfMaxGrade from '../utils/get-percent-of-max-grade'

export default (course, user) => {
  const reportedProjectedGrade = courseUserGradeProjectedReported(course, user)
  return getPercentOfMaxGrade(reportedProjectedGrade)
}
