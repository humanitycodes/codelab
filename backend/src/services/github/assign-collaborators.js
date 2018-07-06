import acceptInvitations from './accept-repository-invitations'
import getRepositoryInvitations from './get-repository-invitations'
import inviteCollaborators from './invite-collaborators'

export default async (githubToken, { users, owner, repo }) => {
  return inviteCollaborators(githubToken, { owner, repo, users })
    .then(() => getRepositoryInvitations(githubToken, { owner, repo }))
    .then(invitations => acceptInvitations({ invitations, users }))
    .catch(error => {
      const userIds = users.map(user => user.userId)
      console.error(
        'Unable to assign collaborators with parameters:',
        { userIds, owner, repo },
        '. Reason:',
        error
      )
    })
}
