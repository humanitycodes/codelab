import generateField from './field'

describe('generateField', () => {
  it('returns the expected field rules when passed a type definition', () => {
    expect(generateField('foo', Boolean))
      .toEqual({
        'foo': {
          '.validate': 'newData.isBoolean()'
        }
      })
  })

  it('returns the expected field rules when passed a complex definition', () => {
    expect(generateField('foo', {
      type: String,
      validate: 'bar',
      matches: 'baz',
      permissions: {
        read: 'buz'
      }
    })).toEqual({
      'foo': {
        '.read': 'buz',
        '.validate': '(newData.isString() && bar && newData.matches(baz))'
      }
    })
  })

  it('returns the expected field rules when a resource', () => {
    expect(generateField('foo', {
      type: Array,
      validate: 'bar',
      matches: 'baz',
      permissions: {
        read: 'buz'
      },
      fields: {
        xxx: Number
      }
    })).toEqual({
      'foo': {
        $fooKey: {
          $other: {
            '.validate': false
          },
          '.read': 'buz',
          '.validate': '(bar && $fooKey.matches(baz))',
          xxx: {
            '.validate': 'newData.isNumber()'
          }
        }
      }
    })
  })
})
