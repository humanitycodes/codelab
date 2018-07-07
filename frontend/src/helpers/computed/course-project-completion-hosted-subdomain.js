import userById from '../finders/user-by-id'
import lessonById from '../finders/lesson-by-id'

// Max size for Heroku subdomains is 30 characters,
// so limit all subdomains to that max length.
const maxChars = 30

export default projectCompletion => {
  const user = userById(projectCompletion.studentUserId)
  const username = user.githubLogin
    .replace(/[^a-z0-9]+/gi, '')
    .slice(0, 15)

  const lesson = lessonById(projectCompletion.lessonId)
  const domainSuffix = lesson.lessonKey
    .replace(/[^a-z0-9-]+/gi, '')
    .replace(/^-+/g, '')
    .replace(/-+$/g, '')

  return `${username}-${domainSuffix}`.toLowerCase().slice(0, maxChars)
}
