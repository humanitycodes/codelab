import generateResource from './resource'

describe('generateResource', () => {
  it('returns the correct rules for a resource', () => {
    const rules = generateResource('foos', {})
    expect(rules).toEqual({
      foos: {
        $foosKey: {
          $other: { '.validate': false }
        }
      }
    })
  })

  it('returns the correct rules for a resource category', () => {
    const rules = generateResource('foos', {}, 'bar')
    expect(rules).toEqual({
      bar: {
        $foosKey: {
          $other: { '.validate': false }
        }
      }
    })
  })

  it('returns the correct rules for a resource category', () => {
    const rules = generateResource('foos', {
      permissions: {
        read: 'bar'
      },
      matches: /some-regex/,
      validate: 'baz',
      fields: {
        xxx: Number,
        yyy: {
          type: String,
          matches: /some-regex/,
          permissions: {
            create: 'mmm'
          }
        },
        zzz: {
          fields: {
            aaa: Boolean
          }
        }
      }
    }, 'bar')
    expect(rules).toEqual({
      bar: {
        $foosKey: {
          '.read': 'bar',
          '.validate': '(baz && $foosKey.matches(/some-regex/))',
          xxx: {
            '.validate': 'newData.isNumber()'
          },
          yyy: {
            '.validate': '(newData.isString() && newData.matches(/some-regex/))',
            '.write': '(!data.exists() && mmm)'
          },
          zzz: {
            aaa: {
              '.validate': 'newData.isBoolean()'
            },
            '$other': {
              '.validate': false
            }
          },
          $other: { '.validate': false }
        }
      }
    })
  })
})
