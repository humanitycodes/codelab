import requestFromGitHub from './request-from-github'

export default async (path, token, body) =>
  requestFromGitHub('put', path, token, body)
