import getFromGitHub from './_helpers/get-from-github'

export default async (token, { owner, repo, issueNumber }) =>
  getFromGitHub(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, token)
