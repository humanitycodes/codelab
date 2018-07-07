import userById from '../finders/user-by-id'
import lessonById from '../finders/lesson-by-id'
import courseProjectCompletionHostedSubdomain from './course-project-completion-hosted-subdomain'
import courseProjectCompletionRepoName from './course-project-completion-repo-name'

export default (course, projectCompletion) => {
  if (!projectCompletion) return ''

  const lesson = lessonById(projectCompletion.lessonId)
  if (!lesson || !lesson.projectHosting) return ''

  if (lesson.projectHosting === 'GitHub Pages') {
    const user = userById(projectCompletion.studentUserId)
    const githubUsername = user.githubLogin
    const repoName = courseProjectCompletionRepoName(course, projectCompletion)
    return `https://${githubUsername}.github.io/${repoName}/`
  }

  const subdomain = courseProjectCompletionHostedSubdomain(projectCompletion)
  if (lesson.projectHosting === 'Surge') {
    return `https://${subdomain}.surge.sh/`
  }
  if (lesson.projectHosting === 'Heroku') {
    return `https://${subdomain}.herokuapp.com/`
  }
}
