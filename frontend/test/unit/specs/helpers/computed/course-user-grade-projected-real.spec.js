import courseUserGradeProjectedReal from '@helpers/computed/course-user-grade-projected-real'

const assertCourseUserGradeProjectedRealWith = ({ currentGrade, percentComplete }, expectation) => {
  it(`returns ${expectation} for a current grade of ${currentGrade} and the course is ${percentComplete}% complete`, () => {
    courseUserGradeProjectedReal.__Rewire__('coursePercentThrough', () => percentComplete)
    expect(courseUserGradeProjectedReal(null, currentGrade)).to.equal(expectation)
    courseUserGradeProjectedReal.__ResetDependency__('coursePercentThrough')
  })
}

describe('@helpers/computed/course-user-grade-projected-real.js', () => {
  assertCourseUserGradeProjectedRealWith(
    { currentGrade: 0, percentComplete: 0 },
    0
  )
  assertCourseUserGradeProjectedRealWith(
    { currentGrade: 0.01, percentComplete: 0 },
    0
  )
  assertCourseUserGradeProjectedRealWith(
    { currentGrade: 1, percentComplete: 75 },
    1.3333333333333333
  )
  assertCourseUserGradeProjectedRealWith(
    { currentGrade: 0.35, percentComplete: 40 },
    0.8749999999999999
  )
  assertCourseUserGradeProjectedRealWith(
    { currentGrade: 0.35, percentComplete: 10 },
    3.4999999999999996
  )
  assertCourseUserGradeProjectedRealWith(
    { currentGrade: 0.37, percentComplete: 10 },
    3.6999999999999997
  )
  assertCourseUserGradeProjectedRealWith(
    { currentGrade: 0.4, percentComplete: 10 },
    4
  )
  assertCourseUserGradeProjectedRealWith(
    { currentGrade: 3.5, percentComplete: 10 },
    35
  )
  assertCourseUserGradeProjectedRealWith(
    { currentGrade: 1.99, percentComplete: 50 },
    3.98
  )
  assertCourseUserGradeProjectedRealWith(
    { currentGrade: 2, percentComplete: 50 },
    4
  )
})
