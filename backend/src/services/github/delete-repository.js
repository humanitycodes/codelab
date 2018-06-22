import deleteFromGitHub from './_helpers/delete-from-github'

export default async (token, { owner, repo }) =>
  deleteFromGitHub(`/repos/${owner}/${repo}`, token)

