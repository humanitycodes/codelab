import store from '@state/store'
import lessonById from '../finders/lesson-by-id'
import courseLessonGradePointsReal from './course-lesson-grade-points-real'

export default (course, user) => {
  return store.getters.projectCompletions.filter(projectCompletion =>
    projectCompletion.courseId === course.courseId &&
    projectCompletion.studentUserId === user.userId &&
    projectCompletion.approved
  ).map(projectCompletion => {
    const lesson = lessonById(projectCompletion.lessonId)
    return courseLessonGradePointsReal(course, lesson)
  }).reduce((a, b) => a + b, 0)
}
