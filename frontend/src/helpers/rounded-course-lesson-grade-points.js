import courseLessonGradePoints from './course-lesson-grade-points'

export default (course, lesson) => {
  const realGradePoints = courseLessonGradePoints(course, lesson)
  return isNaN(realGradePoints)
    ? 0
    : Math.floor(realGradePoints * 100) / 100
}
