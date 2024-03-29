import courseLessons from '../finders/course-lessons'
import courseLessonGradePointsReal from './course-lesson-grade-points-real'
import getGradeRounded from '../utils/get-grade-rounded'

export default course => {
  if (!course.lessonIds.length) return 0

  const totalLessonGradePoints = courseLessons(course)
    .map(lesson => courseLessonGradePointsReal(course, lesson))
    .reduce((a, b) => a + b, 0)

  return getGradeRounded(totalLessonGradePoints / course.lessonIds.length)
}
