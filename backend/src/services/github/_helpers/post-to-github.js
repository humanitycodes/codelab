import requestFromGitHub from './request-from-github'

export default async (path, token, body) =>
  requestFromGitHub('post', path, token, body)
