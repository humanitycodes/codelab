import totalDaysInCourse from '@helpers/total-days-in-course'
import daysSoFarInCourse from '@helpers/days-so-far-in-course'

export default (course) => {
  return Math.min(100, daysSoFarInCourse(course) / totalDaysInCourse(course) * 100)
}
