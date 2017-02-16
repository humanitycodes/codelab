import store from '@state/store'

import averageLessonGradePoints from '@helpers/average-lesson-grade-points'

describe('average-lesson-grade-points.js', () => {
  const course = {
    credits: 2,
    lessonKeys: []
  }

  const lessons = [
    { '.key': 'lesson1', estimatedHours: 7.5 },
    { '.key': 'lesson2', estimatedHours: 7.5 },
    { '.key': 'lesson3', estimatedHours: 8.0 },
    { '.key': 'lesson4', estimatedHours: 7.0 },
    { '.key': 'lesson5', estimatedHours: 5.0 }
  ]
  if (!lessons.find) {
    // Array.prototype.find is undefined, provide substitute
    lessons.find = callback => {
      let foundLesson
      lessons.forEach(lesson => {
        if (callback(lesson)) {
          foundLesson = lesson
        }
      })
      return foundLesson
    }
  }

  before(() => {
    store.getters.lessons = lessons
  })

  beforeEach(() => {
    course.lessonKeys = []
  })

  after(() => {
    delete store.getters.lessons
  })

  it('returns 0 when no lessons in course', () => {
    expect(averageLessonGradePoints(course)).to.equal(0)
  })

  it('returns 1 for one 7.5 hour lesson in 30 hour course', () => {
    course.lessonKeys.push('lesson1')
    expect(averageLessonGradePoints(course)).to.equal(1)
  })

  it('returns 1.06 for one 8 hour lesson in 30 hour course', () => {
    course.lessonKeys.push('lesson3')
    expect(averageLessonGradePoints(course)).to.equal(1.06)
  })

  it('returns 0.66 for one 5 hour lesson in 30 hour course', () => {
    course.lessonKeys.push('lesson5')
    expect(averageLessonGradePoints(course)).to.equal(0.66)
  })

  it('returns 1 for two 7.5 hour lessons in 30 hour course', () => {
    course.lessonKeys.push('lesson1')
    course.lessonKeys.push('lesson2')
    expect(averageLessonGradePoints(course)).to.equal(1)
  })

  it('returns 1 for average 7.5 hour lesson in 30 hour course', () => {
    course.lessonKeys.push('lesson1')
    course.lessonKeys.push('lesson2')
    course.lessonKeys.push('lesson3')
    course.lessonKeys.push('lesson4')
    expect(averageLessonGradePoints(course)).to.equal(1)
  })
})
