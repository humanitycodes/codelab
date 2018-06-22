import putToGitHub from './_helpers/put-to-github'

export default async (token, { owner, repo, invitee }) =>
  putToGitHub(`/repos/${owner}/${repo}/collaborators/${invitee}`, token)
