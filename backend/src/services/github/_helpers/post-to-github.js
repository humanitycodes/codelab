import requestFromGitHub from './request-from-github'

export default async (path, token, body, options) => requestFromGitHub({
  method: 'post',
  path,
  token,
  body,
  ...options
})
