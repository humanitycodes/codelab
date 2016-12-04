import { any, hasRole, keyIsCurrentUser } from './conditions'
import generateResource from './resource'

export default fields => {
  return generateResource('users', {
    permissions: {
      create: keyIsCurrentUser('$usersKey'),
      read: keyIsCurrentUser('$usersKey'),
      update: any(
        hasRole('instructor'),
        keyIsCurrentUser('$usersKey')
      )
    },
    fields
  })
}
