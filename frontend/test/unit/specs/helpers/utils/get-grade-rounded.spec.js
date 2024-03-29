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

  it('rounds 0.0000000001 to 0.0499999999 down to 2 decimal places', () => {
    expect(getGradeRounded(2.1100000001)).to.equal(2.11)
    expect(getGradeRounded(2.111)).to.equal(2.11)
    expect(getGradeRounded(2.113)).to.equal(2.11)
    expect(getGradeRounded(2.1149999999)).to.equal(2.11)
  })

  it('rounds 0.005 to 0.0099999999 up to 2 decimal places', () => {
    expect(getGradeRounded(2.115)).to.equal(2.12)
    expect(getGradeRounded(2.119)).to.equal(2.12)
    expect(getGradeRounded(2.1199999999)).to.equal(2.12)
  })

  it('rounds down to max grade', () => {
    expect(getGradeRounded(gradeMax + 0.5)).to.equal(gradeMax)
  })
})
