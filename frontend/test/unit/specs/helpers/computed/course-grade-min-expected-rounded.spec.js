import courseGradeMinExpectedRounded from '@helpers/computed/course-grade-min-expected-rounded'

const newCourse = (startString, endString) => {
  return {
    startDate: new Date(startString),
    endDate: new Date(endString)
  }
}

describe('@helpers/computed/course-grade-min-expected-rounded.js', () => {
  let clock

  before(() => {
    clock = sinon.useFakeTimers(new Date('2016-01-15').getTime())
  })

  after(() => {
    clock.restore()
  })

  it(`expects 4.0 on last day of course`, () => {
    expect(courseGradeMinExpectedRounded(newCourse('2016-01-01', '2016-01-15'))).to.equal(4.0)
    expect(courseGradeMinExpectedRounded(newCourse('2015-07-01', '2016-01-15'))).to.equal(4.0)
  })

  it(`expects 0.4 on day 1 of 10 day course`, () => {
    expect(courseGradeMinExpectedRounded(newCourse('2016-01-15', '2016-01-25'))).to.equal(0.4)
  })

  it(`expect better than 3.0 when more than 3/4 through course`, () => {
    expect(courseGradeMinExpectedRounded(newCourse('2015-10-24', '2016-02-01'))).to.be.above(3)
    expect(courseGradeMinExpectedRounded(newCourse('2015-10-24', '2016-02-04'))).to.be.above(3)
    expect(courseGradeMinExpectedRounded(newCourse('2015-10-24', '2016-02-14'))).to.be.above(3)
    expect(courseGradeMinExpectedRounded(newCourse('2016-01-01', '2016-01-20'))).to.be.above(3)
  })
})
