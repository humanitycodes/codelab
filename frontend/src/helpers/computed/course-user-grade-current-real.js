import lessonById from '../finders/lesson-by-id'
import courseLessonGradePointsReal from './course-lesson-grade-points-real'

export default (course, user) => {
  if (!course.projectCompletions) return 0.0
  return course.projectCompletions.filter(completion => {
    // The key is on uid for the currently signed in user, .key for all others
    const userId = user.userId
    return (
      completion.submission &&
      completion.submission.isApproved &&
      completion.students.some(student => student.userId === userId)
    )
  }).map(completion => {
    const lesson = lessonById(completion.lessonId)
    return courseLessonGradePointsReal(course, lesson)
  }).reduce((a, b) => a + b, 0)
}
