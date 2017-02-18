import projectedGrade from '@helpers/projected-grade'

const assertProjectedGradeWith = ({ currentGrade, percentComplete }, expectation) => {
  it(`returns ${expectation} for a current grade of ${currentGrade} and the course is ${percentComplete}% complete`, () => {
    projectedGrade.__Rewire__('achievedGradePoints', () => currentGrade)
    projectedGrade.__Rewire__('percentThroughCourse', () => percentComplete)
    expect(projectedGrade()).to.equal(expectation)
    projectedGrade.__ResetDependency__('achievedGradePoints')
    projectedGrade.__ResetDependency__('percentThroughCourse')
  })
}

describe('projected-grade.js', () => {
  assertProjectedGradeWith({ currentGrade: 0, percentComplete: 0 }, 0)
  assertProjectedGradeWith({ currentGrade: 0.01, percentComplete: 0 }, 4)
  assertProjectedGradeWith({ currentGrade: 1, percentComplete: 75 }, 1)
  assertProjectedGradeWith({ currentGrade: 0.35, percentComplete: 40 }, 0)
  assertProjectedGradeWith({ currentGrade: 0.35, percentComplete: 10 }, 3)
  assertProjectedGradeWith({ currentGrade: 0.37, percentComplete: 10 }, 3.5)
  assertProjectedGradeWith({ currentGrade: 0.4, percentComplete: 10 }, 4)
  assertProjectedGradeWith({ currentGrade: 3.5, percentComplete: 10 }, 4)
  assertProjectedGradeWith({ currentGrade: 1.99, percentComplete: 50 }, 3.5)
  assertProjectedGradeWith({ currentGrade: 2, percentComplete: 50 }, 4)
})
