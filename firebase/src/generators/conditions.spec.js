import {
  all, any, not, keyInResource, keyIsCurrentUser, nonEmpty,
  isGreaterThan, isLongerThan, childIsFalsy, isType
} from './conditions'

describe('all helper', () => {
  it('returns the correct condition for (1)', () => {
    expect(all(1)).toEqual('1')
  })

  it('returns the correct condition string for (1, 2, 3)', () => {
    expect(all(1, 2, 3)).toEqual('(1 && 2 && 3)')
  })
})

describe('any helper', () => {
  it('returns the correct condition for (1)', () => {
    expect(any(1)).toEqual('1')
  })

  it('returns the correct condition string for (1, 2, 3)', () => {
    expect(any(1, 2, 3)).toEqual('(1 || 2 || 3)')
  })
})

describe('not helper', () => {
  it('returns the correct condition string for (1)', () => {
    expect(not(1)).toEqual('!1')
  })
})

describe('keyInResource helper', () => {
  it('returns the correct rule for resources', () => {
    expect(keyInResource('foo', 'bar'))
      .toEqual(`root.child('bar/meta/'+foo).exists()`)
  })
  it('returns the correct rule for users', () => {
    expect(keyInResource('foo', 'users'))
      .toEqual(`root.child('users/'+foo).exists()`)
  })
  it('returns the correct rule for roles', () => {
    expect(keyInResource('foo', 'users'))
      .toEqual(`root.child('users/'+foo).exists()`)
  })
})

describe('keyIsCurrentUser helper', () => {
  it('returns the correct rule', () => {
    expect(keyIsCurrentUser('foo'))
      .toEqual('auth.uid === foo')
  })
})

describe('isGreaterThan helper', () => {
  it('returns the correct rule', () => {
    expect(isGreaterThan('foo'))
      .toEqual('newData.val() > foo')
  })
})

describe('isLongerThan helper', () => {
  it('returns the correct rule', () => {
    expect(isLongerThan('foo'))
      .toEqual('newData.val().length > foo')
  })
})

describe('nonEmpty helper', () => {
  it('returns the correct rule', () => {
    expect(nonEmpty)
      .toEqual('newData.val().length > 0')
  })
})

describe('childIsFalsy helper', () => {
  it('returns the correct rule', () => {
    expect(childIsFalsy('foo'))
      .toEqual(`(!newData.child('foo').exists() || newData.child('foo').val() === false)`)
  })
})

describe('isType helper', () => {
  it('returns the correct rule for Boolean', () => {
    expect(isType(Boolean)).toEqual('newData.isBoolean()')
  })

  it('returns the correct rule for String', () => {
    expect(isType(String)).toEqual('newData.isString()')
  })

  it('returns the correct rule for Number', () => {
    expect(isType(Number)).toEqual('newData.isNumber()')
  })

  it('returns the correct rule for Date', () => {
    expect(isType(Date))
      .toEqual('(newData.isNumber() && newData.val() % 1 === 0)')
  })

  it('returns the correct rule for "Integer"', () => {
    expect(isType('Integer'))
      .toEqual('(newData.isNumber() && newData.val() % 1 === 0)')
  })
})
