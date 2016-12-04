import generatePermissions from './permissions'

describe('permissions rules generator', () => {
  it('returns an empty object with no arguments', () => {
    expect(generatePermissions()).toEqual({})
  })

  it('returns an empty object when given an empty object', () => {
    expect(generatePermissions({})).toEqual({})
  })

  it('generates CRUD permissions correctly', () => {
    const permissions = generatePermissions({
      create: 'foo',
      read: 'bar',
      update: 'baz',
      destroy: 'buz'
    })
    expect(permissions).toEqual({
      '.read': 'bar',
      '.write': '((!data.exists() && foo) || (data.exists() && newData.exists() && baz) || (data.exists() && !newData.exists() && buz))'
    })
  })
})
