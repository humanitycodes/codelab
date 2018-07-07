import acceptRepositoryInvitation from './accept-repository-invitation'

export default async ({ invitations, collaborators }) => {
  const invitationDetails = []
  invitations.forEach(invitation => {
    const collaborator = collaborators.find(
      user => user.githubLogin === invitation.invitee.login
    )
    const githubToken = collaborator.githubToken
    const invitationId = invitation.id
    if (githubToken && invitationId) {
      invitationDetails.push({ githubToken, invitationId })
    }
  })
  return Promise.all(invitationDetails.map(
    async invitationDetail => acceptRepositoryInvitation(
      invitationDetail.githubToken,
      { invitationId: invitationDetail.invitationId }
    )
  ))
}
