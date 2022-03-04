import { hasMatchingRole } from './_helpers'

export const canCreateInstructor = () => {
  return hasMatchingRole(['instructor'])
}

export const canReadAllInstructors = () => {
  return hasMatchingRole(['instructor'])
}

export const canUpdateRoles = () => {
  return hasMatchingRole(['instructor'])
}
