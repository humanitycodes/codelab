import requestFromGitHub from './request-from-github'

export default async (path, token, options) => requestFromGitHub({
  method: 'patch',
  path,
  token,
  ...options
})
