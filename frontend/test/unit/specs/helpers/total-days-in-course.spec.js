import totalDaysInCourse from '@helpers/total-days-in-course'

function newCourse (startString, endString) {
  return {
    startDate: new Date(startString),
    endDate: new Date(endString)
  }
}

describe('total-days-in-course.js', () => {
  it('returns 0 if start date is after end date', () => {
    const course = newCourse('2016-12-31', '2016-01-01')
    expect(totalDaysInCourse(course)).to.equal(0)
  })

  it('returns 31 for January course', () => {
    const course = newCourse('2016-01-01', '2016-01-31')
    expect(totalDaysInCourse(course)).to.equal(31)
  })

  it('includes Feb. 29 in leap years', () => {
    const course = newCourse('2016-02-28', '2016-03-01')
    expect(totalDaysInCourse(course)).to.equal(3)
  })

  it('includes every day of the year', () => {
    const course = newCourse('2015-01-01', '2015-12-31')
    expect(totalDaysInCourse(course)).to.equal(365)
  })
})
