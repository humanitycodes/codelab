import achievedGradePoints from '@helpers/achieved-grade-points'
import { maxGrade } from '@helpers/grades'

export default (user, course) => {
  return Math.min(100, achievedGradePoints(user, course) / maxGrade * 100)
}
