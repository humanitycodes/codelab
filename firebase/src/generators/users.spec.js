import { nonEmpty } from './conditions'
import generateUsers from './users'

describe('generateUsers', () => {
  it('returns the correct rules for typical user fields', () => {
    const rules = generateUsers({
      msuUid: {
        type: String,
        validate: nonEmpty
      },
      fullName: {
        type: String,
        validate: nonEmpty
      },
      email: {
        type: String,
        validate: nonEmpty
      },
      github: {
        fields: {
          login: String,
          scope: String,
          token: String,
          tokenType: String,
          userId: Number
        }
      }
    })
    expect(rules).toEqual({
      'users': {
        '$usersKey': {
          '$other': {
            '.validate': false
          },
          '.read': 'auth.uid === $usersKey',
          '.write': `((!data.exists() && auth.uid === $usersKey) || (data.exists() && newData.exists() && (root.child('roles/'+auth.uid+'/instructor').val() === true || auth.uid === $usersKey)))`,
          'email': {
            '.validate': '(newData.isString() && newData.val() > 0)'
          },
          'fullName': {
            '.validate': '(newData.isString() && newData.val() > 0)'
          },
          'github': {
            '$other': {
              '.validate': false
            },
            'login': {
              '.validate': 'newData.isString()'
            },
            'scope': {
              '.validate': 'newData.isString()'
            },
            'token': {
              '.validate': 'newData.isString()'
            },
            'tokenType': {
              '.validate': 'newData.isString()'
            },
            'userId': {
              '.validate': 'newData.isNumber()'
            }
          },
          'msuUid': {
            '.validate': '(newData.isString() && newData.val() > 0)'
          }
        }
      }
    })
  })
})
