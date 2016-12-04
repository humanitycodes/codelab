import generateRoles from './roles'

describe('roles generator', () => {
  it('returns the correct rules', () => {
    const rules = generateRoles(['foo', 'bar'])
    expect(rules).toEqual({
      roles: {
        $rolesKey: {
          '.read': 'auth.uid === $rolesKey',
          '.validate': `root.child('users/'+$rolesKey).exists()`,
          '.write': `(!data.exists() && (auth.uid === $rolesKey && (!newData.child('foo').exists() || newData.child('foo').val() === false) && (!newData.child('bar').exists() || newData.child('bar').val() === false)))`,
          'bar': {
            '.validate': 'newData.isBoolean()',
            '.write': `(data.exists() && newData.exists() && root.child('roles/'+auth.uid+'/bar').val() === true)`
          },
          'foo': {
            '.validate': 'newData.isBoolean()',
            '.write': `(data.exists() && newData.exists() && root.child('roles/'+auth.uid+'/foo').val() === true)`
          }
        }
      }
    })
  })
})
