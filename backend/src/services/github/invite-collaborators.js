import inviteCollaborator from './invite-collaborator'

export default async (githubToken, { owner, repo, collaborators }) => {
  console.log('COLLABORATORS:', collaborators)
  return Promise.all(
    collaborators.map(
      async collaborator => inviteCollaborator(
        githubToken, { owner, repo, invitee: collaborator.githubLogin }
      )
    )
  )
}
