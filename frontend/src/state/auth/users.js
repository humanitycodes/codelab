import { hasMatchingRole } from './_helpers'

export const canUpdateRoles = () => {
  return hasMatchingRole(['instructor'])
}
