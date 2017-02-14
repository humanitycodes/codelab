import daysSoFarInCourse from '@helpers/days-so-far-in-course'

const newCourse = startString => { return { startDate: new Date(startString) } }

describe('days-so-far-in-course.js', () => {
  let clock

  before(() => {
    clock = sinon.useFakeTimers(new Date('2016-03-01').getTime())
  })

  after(() => {
    clock.restore()
  })

  it('returns 0 if course has not started', () => {
    expect(daysSoFarInCourse(newCourse('2016-03-28'))).to.equal(0)
  })

  it('returns 3 for 2/28/16 to 3/1/16', () => {
    expect(daysSoFarInCourse(newCourse('2016-02-28'))).to.equal(3)
  })

  it('returns 61 for 1/1/16 to 3/1/16', () => {
    expect(daysSoFarInCourse(newCourse('2016-01-01'))).to.equal(61)
  })

  it('returns 1 for 3/1/16 to 3/1/16', () => {
    expect(daysSoFarInCourse(newCourse('2016-03-01'))).to.equal(1)
  })
})
