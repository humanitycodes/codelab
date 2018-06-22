import postToGitHub from './_helpers/post-to-github'

export default async (token, { name }) =>
  postToGitHub('/user/repos', token, { name, private: true })
