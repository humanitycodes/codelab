import generateFields from './fields'

describe('generateFields', () => {
  it('returns the expected field rules', () => {
    expect(generateFields({
      foo: Boolean,
      bar: {
        type: String,
        matches: /some-regex/,
        validate: 'baz'
      }
    })).toEqual({
      'foo': {
        '.validate': 'newData.isBoolean()'
      },
      'bar': {
        '.validate': '(newData.isString() && baz && newData.matches(/some-regex/))'
      },
      '$other': {
        '.validate': false
      }
    })
  })
})
