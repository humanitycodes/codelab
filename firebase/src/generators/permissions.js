import { all, any } from './conditions'

// -------
// PRIVATE
// -------

const isCreating = '!data.exists()'
const isUpdating = 'data.exists() && newData.exists()'
const isDestroying = 'data.exists() && !newData.exists()'

// ------
// PUBLIC
// ------

export default permissions => {
  if (!permissions) return {}
  const permissionRules = {}
  if (permissions.read) {
    permissionRules['.read'] = permissions.read
  }
  const writePermissions = any(
    permissions.create && all(isCreating, permissions.create),
    permissions.update && all(isUpdating, permissions.update),
    permissions.destroy && all(isDestroying, permissions.destroy)
  )
  if (writePermissions) {
    permissionRules['.write'] = writePermissions
  }
  return permissionRules
}
