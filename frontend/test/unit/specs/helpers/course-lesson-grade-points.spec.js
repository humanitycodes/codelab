import { maxGrade } from '@helpers/grades'
import courseLessonGradePoints from '@helpers/course-lesson-grade-points'

const gradePerWeekForOneCreditCourse = maxGrade / 15

const newCourse = credits => { return { credits: credits } }
const newLesson = estimatedHours => { return { estimatedHours: estimatedHours } }

describe('course-lesson-grade-points.js', () => {
  it('returns 0 grade points for 0 hours of lesson work', () => {
    expect(courseLessonGradePoints(newCourse(2), newLesson(0))).to.equal(0)
  })

  it('expects 1:1 ratio of lesson work and course credits', () => {
    expect(courseLessonGradePoints(newCourse(1), newLesson(1))).to.equal(gradePerWeekForOneCreditCourse)
    expect(courseLessonGradePoints(newCourse(2), newLesson(2))).to.equal(gradePerWeekForOneCreditCourse)
  })

  it('allows 15 hour lesson to ace a 1 credit course', () => {
    expect(courseLessonGradePoints(newCourse(1), newLesson(15))).to.equal(maxGrade)
  })
})
