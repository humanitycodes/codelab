import totalDaysInCourse from '@helpers/total-days-in-course'
import daysSoFarInCourse from '@helpers/days-so-far-in-course'
import normalizeGradePoints from '@helpers/normalize-grade-points'
import { maxGrade } from '@helpers/grades'

export default (course) => {
  const daysInCourse = totalDaysInCourse(course)
  const daysSoFar = daysSoFarInCourse(course)
  const daysLeft = daysInCourse - daysSoFar
  const daysOfPadding = Math.min(21, daysLeft * 0.1)
  const realGradeExpectation = daysSoFar / (daysInCourse - daysOfPadding) * maxGrade
  return normalizeGradePoints(realGradeExpectation)
}
