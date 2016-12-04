import generateMeta from './meta'

describe('generateMeta', () => {
  it('generates the correct permissions and validations when passed an object', () => {
    const rules = generateMeta({
      type: String,
      validate: 'foo',
      matches: /some-regex/,
      permissions: {
        read: 'bar'
      }
    })
    expect(rules).toEqual({
      '.read': 'bar',
      '.validate': '(newData.isString() && foo && newData.matches(/some-regex/))'
    })
  })

  it('generates the correct permissions and validations when passed a raw type', () => {
    const rules = generateMeta(String)
    expect(rules).toEqual({
      '.validate': 'newData.isString()'
    })
  })
})
