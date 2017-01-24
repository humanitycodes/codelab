import { maxGrade } from '@helpers/grades'

const normalizedSemesterWeeks = 15

export default (course, lesson) => {
  const gradePointsPerHour = maxGrade / (normalizedSemesterWeeks * course.credits)
  return gradePointsPerHour * lesson.estimatedHours
}
