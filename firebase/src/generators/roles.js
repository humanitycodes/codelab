import {
  all, keyInResource, keyIsCurrentUser, childIsFalsy, isType, hasRole
} from './conditions'
import generatePermissions from './permissions'
import mapAndMerge from '../utils/map-and-merge'

export default roles => {
  return {
    roles: {
      $rolesKey: {
        '.validate': keyInResource('$rolesKey', 'users'),
        ...generatePermissions({
          read: keyIsCurrentUser('$rolesKey'),
          // Roles can only be created by user they belong to
          // and they cannot sign up with any roles set to true
          create: all(
            keyIsCurrentUser('$rolesKey'),
            ...roles.map(role => {
              return childIsFalsy(role)
            })
          )
        }),
        ...mapAndMerge(roles, role => {
          return {
            [role]: {
              '.validate': isType(Boolean),
              ...generatePermissions({ update: hasRole(role) })
            }
          }
        })
      }
    }
  }
}
