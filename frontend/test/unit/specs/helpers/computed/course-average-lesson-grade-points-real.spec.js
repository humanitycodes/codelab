import store from '@state/store'

import courseAverageLessonGradePointsReal from '@helpers/computed/course-average-lesson-grade-points-real'

describe('@helpers/computed/course-average-lesson-grade-points-real.js', () => {
  const course = {
    credits: 2,
    lessonKeys: []
  }

  const lessons = [
    { '.key': 'lesson1', estimatedHours: 7.0 },
    { '.key': 'lesson2', estimatedHours: 7.0 },
    { '.key': 'lesson3', estimatedHours: 8.0 },
    { '.key': 'lesson4', estimatedHours: 6.0 },
    { '.key': 'lesson5', estimatedHours: 4.0 }
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
    expect(courseAverageLessonGradePointsReal(course)).to.equal(0)
  })

  it('returns 1 for one 7 hour lesson in 28 hour course', () => {
    course.lessonKeys.push('lesson1')
    expect(courseAverageLessonGradePointsReal(course)).to.equal(1)
  })

  it('returns 1.14 for one 8 hour lesson in 28 hour course', () => {
    course.lessonKeys.push('lesson3')
    expect(courseAverageLessonGradePointsReal(course)).to.equal(1.14)
  })

  it('returns 0.57 for one 4 hour lesson in 28 hour course', () => {
    course.lessonKeys.push('lesson5')
    expect(courseAverageLessonGradePointsReal(course)).to.equal(0.57)
  })

  it('returns 1 for two 7 hour lessons in 28 hour course', () => {
    course.lessonKeys.push('lesson1')
    course.lessonKeys.push('lesson2')
    expect(courseAverageLessonGradePointsReal(course)).to.equal(1)
  })

  it('returns 1 for average 7 hour lesson in 28 hour course', () => {
    course.lessonKeys.push('lesson1')
    course.lessonKeys.push('lesson2')
    course.lessonKeys.push('lesson3')
    course.lessonKeys.push('lesson4')
    expect(courseAverageLessonGradePointsReal(course)).to.equal(1)
  })
})
