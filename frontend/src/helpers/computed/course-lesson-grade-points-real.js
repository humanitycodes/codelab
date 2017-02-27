import maxGrade from '@constants/grade-max'
import normalizedSemesterWeeks from '@constants/normalized-semester-weeks'

// Calculate grade points for the lesson based on the
// course credits and the lesson's estimated hours.
export default (course, lesson) => {
  const gradePointsPerHour = maxGrade / (normalizedSemesterWeeks * course.credits)
  return gradePointsPerHour * lesson.estimatedHours
}
