import sortByPosition from '@helpers/utils/sort-by-position'

describe('@helpers/utils/sort-by-position.js', () => {
  const position1 = { position: 1, value: 'a' }
  const position2 = { position: 2, value: 'b' }
  const position3 = { position: 3, value: 'c' }

  const unsortedArray = [position3, position1, position2]
  const sortedArray = sortByPosition(unsortedArray)

  it('does not change array size', () => {
    expect(sortedArray.length).to.equal(unsortedArray.length)
  })

  it('orders array by position value', () => {
    expect(sortedArray[0].position).to.equal(1)
    expect(sortedArray[1].position).to.equal(2)
    expect(sortedArray[2].position).to.equal(3)
  })

  it('does not affect other properties', () => {
    expect(sortedArray[0].value).to.equal('a')
    expect(sortedArray[1].value).to.equal('b')
    expect(sortedArray[2].value).to.equal('c')
  })
})
