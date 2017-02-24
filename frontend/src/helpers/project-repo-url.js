export default (repoUsername, projectName) => {
  return [
    'https://github.com/',
    repoUsername,
    '/',
    projectName
  ].join('')
}
