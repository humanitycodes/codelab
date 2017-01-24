import store from '@state/store'
import courseLessonGradePoints from '@helpers/course-lesson-grade-points'

export default (user, course) => {
  const realGradePoints = course.projectCompletions.filter(completion => {
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
    const lesson = store.getters.lessons.find(lesson => {
      return lesson['.key'] === completion.lessonKey
    })
    return courseLessonGradePoints(course, lesson)
  }).reduce((a, b) => a + b, 0)

  return isNaN(realGradePoints)
    ? 0
    : Math.floor(realGradePoints * 100) / 100
}
