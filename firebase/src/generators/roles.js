import {
  all, any, keyInResource, keyIsCurrentUser, childIsFalsy, isType, hasRole
} from './conditions'
import generatePermissions from './permissions'
import mapAndMerge from '../utils/map-and-merge'

export default roles => {
  return {
    roles: {
      $rolesKey: {
        '.validate': keyInResource('$rolesKey', 'users'),
        ...generatePermissions({
          read: any(
            keyIsCurrentUser('$rolesKey'),
            hasRole('instructor')
          ),
          // Roles can only be created by either:
          // a) The user they belong to at sign up with no roles set to true
          // b) An instructor
          create: all(
            keyIsCurrentUser('$rolesKey'),
            ...roles.map(role => {
              return childIsFalsy(role)
            })
          ),
          // Roles can only be updated or deleted by an instructor
          update: hasRole('instructor'),
          destroy: hasRole('instructor')
        }),
        ...mapAndMerge(roles, role => {
          return {
            [role]: {
              '.validate': isType(Boolean),
              ...generatePermissions({ update: hasRole('instructor') })
            }
          }
        })
      }
    }
  }
}
