import getFromGitHub from './_helpers/get-from-github'

export default async (token, { owner, repo }) =>
  getFromGitHub(`/repos/${owner}/${repo}`, token)

