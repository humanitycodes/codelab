import inviteCollaborator from './invite-collaborator'

export default async (githubToken, { owner, repo, users }) => {
  const invitationRequests = users.map(
    user => inviteCollaborator(
      githubToken, { owner, repo, invitee: user.githubLogin }
    )
  )
  return Promise.all(invitationRequests)
}
