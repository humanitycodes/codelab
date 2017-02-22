import projectedGrade from '@helpers/projected-grade'
import { maxGrade } from '@helpers/grades'

export default (user, course) => {
  return Math.min(100, projectedGrade(user, course) / maxGrade * 100)
}
