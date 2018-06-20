import store from '@state/store'

// Convert role to property name (e.g. 'instructor' => 'isInstructor')
export const roleToPropertyName = role => {
  return 'is' + role.replace(/^./, l => l.toUpperCase())
}

// Check if the current user has one specific role
export const hasRole = role => {
  const currentUser = store.state.users.currentUser
  if (!currentUser) return false
  const roleProperty = roleToPropertyName(role)
  return currentUser.hasOwnProperty(roleProperty) && currentUser[roleProperty]
}

// Check if the current user has at least one of the provided roles
export const hasMatchingRole = authorizedRoles => {
  return authorizedRoles.some(role => hasRole(role))
}
