import requestFromGitHub from './request-from-github'

export default async (path, token, options) => requestFromGitHub({
  method: 'get',
  path,
  token,
  ...options
})
