import store from '@state/store'
import arrayFindSubstitute from '../../_helpers/array-find-substitute'
import courseAverageLessonGradePointsReal from '@helpers/computed/course-average-lesson-grade-points-real'

describe('@helpers/computed/course-average-lesson-grade-points-real.js', () => {
  const course = {
    credits: 2,
    lessonIds: []
  }

  const lessons = [
    { lessonId: 1, estimatedHours: 7.0 },
    { lessonId: 2, estimatedHours: 7.0 },
    { lessonId: 3, estimatedHours: 8.0 },
    { lessonId: 4, estimatedHours: 6.0 },
    { lessonId: 5, estimatedHours: 4.0 }
  ]

  before(() => {
    store.commit('SET_ALL_LESSONS', lessons)

    // Array.prototype.find is undefined, provide substitute
    store.state.lessons.all.find = arrayFindSubstitute(store.state.lessons.all)
  })

  beforeEach(() => {
    course.lessonIds = []
  })

  after(() => {
    store.commit('SET_ALL_LESSONS', [])
  })

  it('returns 0 when no lessons in course', () => {
    expect(courseAverageLessonGradePointsReal(course)).to.equal(0)
  })

  it('returns 1 for one 7 hour lesson in 28 hour course', () => {
    course.lessonIds.push(1)
    expect(courseAverageLessonGradePointsReal(course)).to.equal(1)
  })

  it('returns 1.14 for one 8 hour lesson in 28 hour course', () => {
    course.lessonIds.push(3)
    expect(courseAverageLessonGradePointsReal(course)).to.equal(1.14)
  })

  it('returns 0.57 for one 4 hour lesson in 28 hour course', () => {
    course.lessonIds.push(5)
    expect(courseAverageLessonGradePointsReal(course)).to.equal(0.57)
  })

  it('returns 1 for two 7 hour lessons in 28 hour course', () => {
    course.lessonIds.push(1)
    course.lessonIds.push(2)
    expect(courseAverageLessonGradePointsReal(course)).to.equal(1)
  })

  it('returns 1 for average 7 hour lesson in 28 hour course', () => {
    course.lessonIds.push(1)
    course.lessonIds.push(2)
    course.lessonIds.push(3)
    course.lessonIds.push(4)
    expect(courseAverageLessonGradePointsReal(course)).to.equal(1)
  })
})
