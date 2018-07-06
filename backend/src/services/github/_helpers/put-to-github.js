import requestFromGitHub from './request-from-github'

export default async (path, token, body, options) => requestFromGitHub({
  method: 'put',
  path,
  token,
  body,
  ...options
})
