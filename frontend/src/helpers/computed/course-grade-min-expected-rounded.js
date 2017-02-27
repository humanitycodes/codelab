import courseDaysTotal from './course-days-total'
import courseDaysSoFar from './course-days-so-far'
import getGradeRounded from '../utils/get-grade-rounded'
import maxGrade from '@constants/grade-max'

// The minimum grade expected at this point in the course,
// if the student is going to achieve a 4.0.
export default course => {
  const daysInCourse = courseDaysTotal(course)
  const daysSoFar = courseDaysSoFar(course)
  const daysLeft = daysInCourse - daysSoFar
  // Recommend students complete their work either 3 weeks before the
  // semester ends (2 weeks before finals), or when 90% of the days left
  // are completed. This subtly encourages students to gain some padding
  // in the earlier parts of the semester, so that they're ready when
  // things get busy.
  const daysOfPadding = Math.min(21, daysLeft * 0.1)
  const realGradeExpectation = daysSoFar / (daysInCourse - daysOfPadding) * maxGrade
  return getGradeRounded(realGradeExpectation)
}
