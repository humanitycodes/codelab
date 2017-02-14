import percentThroughCourse from '@helpers/percent-through-course'

function newCourse (startString, endString) {
  return {
    startDate: new Date(startString),
    endDate: new Date(endString)
  }
}

describe('percent-through-course.js', () => {
  let clock

  before(() => {
    clock = sinon.useFakeTimers(new Date('2016-03-01').getTime())
  })

  after(() => {
    clock.restore()
  })

  it('returns 0 if course has not started', () => {
    const course = newCourse('2016-04-01', '2016-05-01')
    expect(percentThroughCourse(course)).to.equal(0)
  })

  it('returns 10 on first day of 10 day course', () => {
    const course = newCourse('2016-03-01', '2016-03-10')
    expect(percentThroughCourse(course)).to.equal(10)
  })

  it('returns 50 on fifth day of 10 day course', () => {
    const course = newCourse('2016-02-26', '2016-03-06')
    expect(percentThroughCourse(course)).to.equal(50)
  })

  it('returns 100 on last day of 10 day course', () => {
    const course = newCourse('2016-02-21', '2016-03-01')
    expect(percentThroughCourse(course)).to.equal(100)
  })

  it('returns 100 on day after end of course', () => {
    const course = newCourse('2016-02-20', '2016-02-29')
    expect(percentThroughCourse(course)).to.equal(100)
  })
})
