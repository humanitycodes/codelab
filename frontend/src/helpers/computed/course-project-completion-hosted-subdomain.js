import userByKey from '../finders/user-by-key'

// Max size for Heroku subdomains is 30 characters,
// so limit all subdomains to that max length.
const maxChars = 30

export default (course, projectCompletion) => {
  const user = userByKey(projectCompletion.students[0]['.key'])
  const username = user.email
    .replace(/@.+/, '')
    .replace(/[^a-z0-9]+/gi, '')
    .slice(0, 15)
  const domainSuffix = projectCompletion.lessonKey
    .replace(/[^a-z0-9-]+/gi, '')
    .replace(/^-+/g, '')
    .replace(/-+$/g, '')
    .slice(0, maxChars - username.length - 1)
  return [username, domainSuffix].join('-').toLowerCase()
}
