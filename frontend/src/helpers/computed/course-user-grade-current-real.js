import lessonByKey from '../finders/lesson-by-key'
import courseLessonGradePointsReal from './course-lesson-grade-points-real'

export default (course, user) => {
  return course.projectCompletions.filter(completion => {
    // The key is on uid for the currently signed in user, .key for all others
    const userKey = user.uid || user['.key']
    return (
      completion.submission &&
      completion.submission.isApproved &&
      completion.students.some(student => {
        return student['.key'] === userKey
      })
    )
  }).map(completion => {
    const lesson = lessonByKey(completion.lessonKey)
    return courseLessonGradePointsReal(course, lesson)
  }).reduce((a, b) => a + b, 0)
}
