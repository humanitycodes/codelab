import round from '@helpers/utils/round'

describe('@helpers/utils/round.js', () => {
  it('rounds whole numbers to whole numbers', () => {
    for (let wholeNumber = 0; wholeNumber <= 4; wholeNumber++) {
      expect(round(wholeNumber)).to.equal(wholeNumber)
    }
  })

  it('rounds special case 1.005 to 1.01', () => {
    expect(round(1.005)).to.equal(1.01)
  })

  it('rounds half and larger up', () => {
    expect(round(1.007)).to.equal(1.01)
    expect(round(1.009)).to.equal(1.01)
    expect(round(1.009999999999)).to.equal(1.01)
  })

  it('rounds less than half down', () => {
    expect(round(1.014)).to.equal(1.01)
    expect(round(1.013)).to.equal(1.01)
    expect(round(1.011)).to.equal(1.01)
    expect(round(1.014999999999)).to.equal(1.01)
  })

  it('rounds to expected number of digits', () => {
    expect(round(1.5454545, 0)).to.equal(2)
    expect(round(1.5454545, 1)).to.equal(1.5)
    expect(round(1.5454545, 2)).to.equal(1.55)
    expect(round(1.5454545, 3)).to.equal(1.545)
    expect(round(1.5454545, 4)).to.equal(1.5455)
    expect(round(1.5454545, 5)).to.equal(1.54545)
    expect(round(1.5454545, 6)).to.equal(1.545455)
    expect(round(1.5454545, 7)).to.equal(1.5454545)
  })
})
