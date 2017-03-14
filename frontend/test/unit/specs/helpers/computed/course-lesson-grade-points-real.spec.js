import maxGrade from '@constants/grade-max'
import normalizedSemesterWeeks from '@constants/normalized-semester-weeks'
import courseLessonGradePointsReal from '@helpers/computed/course-lesson-grade-points-real'

const gradePerWeekForOneCreditCourse = maxGrade / normalizedSemesterWeeks

const newCourse = credits => { return { credits: credits } }
const newLesson = estimatedHours => { return { estimatedHours: estimatedHours } }

describe('@helpers/computed/course-lesson-grade-points-real.js', () => {
  it('returns 0 grade points for 0 hours of lesson work', () => {
    expect(courseLessonGradePointsReal(newCourse(2), newLesson(0))).to.equal(0)
  })

  it('expects 1:1 ratio of lesson work and course credits', () => {
    expect(courseLessonGradePointsReal(newCourse(1), newLesson(1))).to.equal(gradePerWeekForOneCreditCourse)
    expect(courseLessonGradePointsReal(newCourse(2), newLesson(2))).to.equal(gradePerWeekForOneCreditCourse)
  })

  it('allows 14 hour lesson to ace a 1 credit course', () => {
    expect(courseLessonGradePointsReal(newCourse(1), newLesson(14))).to.equal(maxGrade)
  })
})
