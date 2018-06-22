import requestFromGitHub from './request-from-github'

export default async (path, token) => requestFromGitHub('get', path, token)
