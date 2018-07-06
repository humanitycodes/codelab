import patchToGitHub from './_helpers/patch-to-github'

export default async (token, { invitationId }) =>
  patchToGitHub(`/user/repository_invitations/${invitationId}`, token)
