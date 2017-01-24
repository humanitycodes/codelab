import totalDaysInCourse from '@helpers/total-days-in-course'
import daysSoFarInCourse from '@helpers/days-so-far-in-course'
import { maxGrade } from '@helpers/grades'

export default (course) => {
  const daysOfPadding = Math.min(21, totalDaysInCourse(course) * 0.1)
  const realGradeExpectation = daysSoFarInCourse(course) / (totalDaysInCourse(course) - daysOfPadding) * maxGrade
  return isNaN(realGradeExpectation)
    ? 0
    : Math.floor(realGradeExpectation * 100) / 100
}
