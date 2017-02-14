import normalizeGradePoints from '@helpers/normalize-grade-points'

describe('normalize-grade-points.js', () => {
  it('returns 0 for non-numbers', () => {
    expect(normalizeGradePoints('')).to.equal(0)
    expect(normalizeGradePoints('e')).to.equal(0)
    expect(normalizeGradePoints(null)).to.equal(0)
    expect(normalizeGradePoints(undefined)).to.equal(0)
  })

  it('limits numbers to 2 decimal places', () => {
    expect(normalizeGradePoints(73.12345)).to.equal(73.12)
  })

  it('always rounds down', () => {
    expect(normalizeGradePoints(12.11999)).to.equal(12.11)
  })
})
