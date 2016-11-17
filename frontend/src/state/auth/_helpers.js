import store from '@state/store'

// Check if the current user has at least one of the provided roles.
export const hasMatchingRole = authorizedRoles => {
  const { userRoles } = store.state.users
  if (!userRoles) return false
  const userRolesList = Object.keys(userRoles)
    .filter(role => userRoles[role])
  return userRolesList.some(role => authorizedRoles.includes(role))
}
