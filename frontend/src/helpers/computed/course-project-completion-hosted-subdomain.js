import userById from '../finders/user-by-id'
import lessonById from '../finders/lesson-by-id'

// Max size for Heroku subdomains is 30 characters,
// so limit all subdomains to that max length.
const maxChars = 30

export default projectCompletion => {
  const user = userById(projectCompletion.studentUserId)
  const username = user.githubLogin
    // remove non-alphanumeric characters
    .replace(/[^a-z0-9]+/gi, '')
    // trim to 15 characters or less
    .slice(0, 15)

  const lesson = lessonById(projectCompletion.lessonId)
  const domainSuffix = lesson.lessonKey
    // remove characters that aren't alphanumeric or a hyphen
    .replace(/[^a-z0-9-]+/gi, '')
    // remove leading hyphens
    .replace(/^-+/g, '')
    // remove trailing hyphens
    .replace(/-+$/g, '')

  const subdomain = `${username}-${domainSuffix}`
    .toLowerCase()
    // ensure the string does not exceed the max length
    .slice(0, maxChars)
    // remove special characters from the end
    .replace(/[^a-z0-9]+$/gi, '')

  return subdomain
}
