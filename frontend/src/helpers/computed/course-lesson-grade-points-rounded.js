import courseLessonGradePointsReal from './course-lesson-grade-points-real'
import getGradeRounded from '../utils/get-grade-rounded'

export default (course, lesson) => {
  const realGradePoints = courseLessonGradePointsReal(course, lesson)
  return getGradeRounded(realGradePoints)
}
