import {
  allRoleNames,
  userHasRole,
  hasMatchingRole
} from './_helpers'

export const canUpdateRoles = () => {
  return hasMatchingRole(['instructor'])
}

// Determine if the roles are different between two user objects.
// This is helpful for knowing if data needs to be re-synced.
export const userRolesHaveChanged = (oldUser, newUser) => {
  // No changes if they're both null
  if (!oldUser && !newUser) return false

  // Roles are different if one (and only one) user is not null
  if (oldUser ? !newUser : !!newUser) return true

  return allRoleNames.some(role => {
    const oldUserHasRole = userHasRole(oldUser, role)
    const newUserHasRole = userHasRole(newUser, role)
    return oldUserHasRole ? !newUserHasRole : newUserHasRole
  })
}
