import achievedGradePoints from '@helpers/achieved-grade-points'
import percentThroughCourse from '@helpers/percent-through-course'
import { maxGrade } from '@helpers/grades'

export default (user, course) => {
  const realGrade = achievedGradePoints(user, course) / (percentThroughCourse(course) / 100)
  const gradeRoundedDownToNearestPointFive = Math.floor(realGrade * 2) / 2
  return Math.min(
    maxGrade,
    gradeRoundedDownToNearestPointFive === 0.5
      ? 0
      : gradeRoundedDownToNearestPointFive
  )
}
