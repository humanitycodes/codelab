import store from '@state/store'
import courseLessonGradePoints from '@helpers/course-lesson-grade-points'
import normalizeGradePoints from '@helpers/normalize-grade-points'

export default (course) => {
  if (!course.lessonKeys.length) return 0

  const totalLessonGradePoints = course.lessonKeys.map(lessonKey => {
    const lesson = store.getters.lessons.find(lesson => {
      return lesson['.key'] === lessonKey
    })
    return courseLessonGradePoints(course, lesson)
  }).reduce((a, b) => a + b, 0)

  return normalizeGradePoints(totalLessonGradePoints / course.lessonKeys.length)
}
