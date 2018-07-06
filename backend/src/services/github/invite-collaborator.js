import putToGitHub from './_helpers/put-to-github'

export default async (token, { owner, repo, invitee }) => {
  if (owner !== invitee) {
    return putToGitHub(`/repos/${owner}/${repo}/collaborators/${invitee}`, token)
  }
}
