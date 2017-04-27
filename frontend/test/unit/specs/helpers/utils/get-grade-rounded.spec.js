import getGradeRounded from '@helpers/utils/get-grade-rounded'
import gradeMax from '@constants/grade-max'

describe('@helpers/utils/get-grade-rounded.js', () => {
  it('returns 0 for non-numbers', () => {
    expect(getGradeRounded('')).to.equal(0)
    expect(getGradeRounded('e')).to.equal(0)
    expect(getGradeRounded(null)).to.equal(0)
    expect(getGradeRounded(undefined)).to.equal(0)
  })

  it('limits numbers to 2 decimal places', () => {
    expect(getGradeRounded(3.12345)).to.equal(3.12)
  })

  it('always rounds down', () => {
    expect(getGradeRounded(2.11999)).to.equal(2.11)
  })

  it('rounds down to max grade', () => {
    expect(getGradeRounded(gradeMax + 0.5)).to.equal(gradeMax)
  })
})
