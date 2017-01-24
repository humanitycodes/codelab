import totalDaysInCourse from '@helpers/total-days-in-course'
import daysSoFarInCourse from '@helpers/days-so-far-in-course'
import normalizeGradePoints from '@helpers/normalize-grade-points'
import { maxGrade } from '@helpers/grades'

export default (course) => {
  const daysOfPadding = Math.min(21, totalDaysInCourse(course) * 0.1)
  const realGradeExpectation = daysSoFarInCourse(course) / (totalDaysInCourse(course) - daysOfPadding) * maxGrade
  return normalizeGradePoints(realGradeExpectation)
}
