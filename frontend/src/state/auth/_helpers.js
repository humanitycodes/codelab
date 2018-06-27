import store from '@state/store'

export const allRoleNames = [
  'instructor'
]

// Convert role to property name (e.g. 'instructor' => 'isInstructor')
export const roleToPropertyName = role => {
  return 'is' + role.replace(/^./, l => l.toUpperCase())
}

// Check if specified user has one specific role
export const userHasRole = (user, role) => {
  if (!user) return false
  const roleProperty = roleToPropertyName(role)
  return user.hasOwnProperty(roleProperty) && user[roleProperty]
}

// Check if the current user has one specific role
export const hasRole = role => {
  return userHasRole(store.state.users.currentUser, role)
}

// Check if the current user has at least one of the provided roles
export const hasMatchingRole = authorizedRoles => {
  return authorizedRoles.some(role => hasRole(role))
}
