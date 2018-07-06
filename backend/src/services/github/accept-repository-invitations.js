import acceptRepositoryInvitation from './accept-repository-invitation'

export default async ({ invitations, users }) => {
  let acceptanceRequests = []
  invitations.forEach(invitation => {
    const inviteeToken = users.find(
      user => user.githubLogin === invitation.invitee.login
    )
    const invitationId = invitation.id
    if (inviteeToken && invitationId) {
      acceptanceRequests.push(
        acceptRepositoryInvitation(inviteeToken, { invitationId })
      )
    }
  })
  return Promise.all(acceptanceRequests)
}
