import courseDaysTotal from './course-days-total'
import courseDaysSoFar from './course-days-so-far'

export default course => {
  return Math.min(100, courseDaysSoFar(course) / courseDaysTotal(course) * 100)
}
