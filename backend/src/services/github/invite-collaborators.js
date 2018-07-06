import inviteCollaborator from './invite-collaborator'

export default async (githubToken, { owner, repo, users }) => {
  return Promise.all(users.map(
    async user => inviteCollaborator(
      githubToken, { owner, repo, invitee: user.githubLogin }
    )
  ))
}
