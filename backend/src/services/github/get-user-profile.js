import getFromGitHub from './_helpers/get-from-github'

export default async token => getFromGitHub('/user', token)
