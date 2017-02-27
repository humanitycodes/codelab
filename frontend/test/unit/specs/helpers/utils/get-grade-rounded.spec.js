import getGradeRounded from '@helpers/utils/get-grade-rounded'

describe('@helpers/utils/get-grade-rounded.js', () => {
  it('returns 0 for non-numbers', () => {
    expect(getGradeRounded('')).to.equal(0)
    expect(getGradeRounded('e')).to.equal(0)
    expect(getGradeRounded(null)).to.equal(0)
    expect(getGradeRounded(undefined)).to.equal(0)
  })

  it('limits numbers to 2 decimal places', () => {
    expect(getGradeRounded(73.12345)).to.equal(73.12)
  })

  it('always rounds down', () => {
    expect(getGradeRounded(12.11999)).to.equal(12.11)
  })
})
