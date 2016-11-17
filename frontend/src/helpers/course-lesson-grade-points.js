const maxGradePoints = 4
const normalizedSemesterWeeks = 15

export default (course, lesson) => {
  const gradePointsPerHour = maxGradePoints / (normalizedSemesterWeeks * course.credits)
  return gradePointsPerHour * lesson.estimatedHours
}
