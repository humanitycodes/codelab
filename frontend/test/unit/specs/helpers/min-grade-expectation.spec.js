import minGradeExpectation from '@helpers/min-grade-expectation'

const newCourse = (startString, endString) => {
  return {
    startDate: new Date(startString),
    endDate: new Date(endString)
  }
}

describe('min-grade-expectation.js', () => {
  let clock

  before(() => {
    clock = sinon.useFakeTimers(new Date('2016-01-15').getTime())
  })

  after(() => {
    clock.restore()
  })

  it(`expects 4.0 on last day of course`, () => {
    expect(minGradeExpectation(newCourse('2016-01-01', '2016-01-15'))).to.equal(4.0)
    expect(minGradeExpectation(newCourse('2015-07-01', '2016-01-15'))).to.equal(4.0)
  })

  it(`expects 0.4 on day 1 of 10 day course`, () => {
    expect(minGradeExpectation(newCourse('2016-01-15', '2016-01-25'))).to.equal(0.4)
  })

  it(`expects 3.37 with 18 days left in 100 day course`, () => {
    expect(minGradeExpectation(newCourse('2015-10-24', '2016-02-01'))).to.equal(3.37)
  })

  it(`expects 3.37 with 21 days left in 100 day course`, () => {
    expect(minGradeExpectation(newCourse('2015-10-24', '2016-02-04'))).to.equal(3.28)
  })
})
