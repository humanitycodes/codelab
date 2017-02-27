import userByKey from '../finders/user-by-key'

// Max size for Heroku subdomains is 30 characters,
// so limit all subdomains to that max length.
const maxChars = 30

export default (course, projectCompletion) => {
  const user = userByKey(projectCompletion.students[0]['.key'])
  const msuUsername = user.email
    .replace(/@.+/, '')
    .replace(/\W/g, '')
    .slice(0, 15)
  const shortProjectKey = projectCompletion.projectKey.slice(msuUsername.length - maxChars)
  return [msuUsername, shortProjectKey].join('').toLowerCase()
}
