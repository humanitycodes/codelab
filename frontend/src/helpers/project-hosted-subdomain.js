// Max size for Heroku subdomains is 30 characters,
// so limit all subdomains to that max length.
const maxChars = 30

export default (hosting, email, projectKey, projectName) => {
  if (hosting === 'GitHub Pages') {
    return projectName
  }
  const username = email
    .replace(/@.+/, '')
    .replace(/\W/g, '')
    .slice(0, 15)
  const shortProjectKey = projectKey.slice(username.length - maxChars)
  return [username, shortProjectKey].join('').toLowerCase()
}
