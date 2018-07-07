import acceptRepositoryInvitations from './accept-repository-invitations'
import getRepositoryInvitations from './get-repository-invitations'
import inviteCollaborators from './invite-collaborators'

export default async (githubToken, { collaborators, owner, repo }) => {
  await inviteCollaborators(githubToken, { owner, repo, collaborators })
  const invitations = await getRepositoryInvitations(githubToken, { owner, repo })
  await acceptRepositoryInvitations({ invitations, collaborators })
}
