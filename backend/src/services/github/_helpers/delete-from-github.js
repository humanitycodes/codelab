import requestFromGitHub from './request-from-github'

export default async (path, token, options) => requestFromGitHub({
  method: 'delete',
  path,
  token,
  ...options
})
