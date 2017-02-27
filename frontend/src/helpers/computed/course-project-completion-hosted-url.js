import userByKey from '../finders/user-by-key'
import lessonByKey from '../finders/lesson-by-key'
import courseProjectCompletionHostedSubdomain from './course-project-completion-hosted-subdomain'
import courseProjectCompletionRepoName from './course-project-completion-repo-name'

export default (course, projectCompletion) => {
  if (!projectCompletion) return ''

  if (projectCompletion.hostedUrl) {
    return projectCompletion.hostedUrl
  }

  const project = lessonByKey(projectCompletion.lessonKey).projects[0]
  if (!project) return ''

  if (project.hosting === 'GitHub Pages') {
    const user = userByKey(projectCompletion.students[0]['.key'])
    const githubUsername = user.github.login
    const repoName = courseProjectCompletionRepoName(course, projectCompletion)
    return `https://${githubUsername}.github.io/${repoName}/`
  }

  const subdomain = courseProjectCompletionHostedSubdomain(course, projectCompletion)
  if (project.hosting === 'Surge') {
    return `https://${subdomain}.surge.sh/`
  }
  if (project.hosting === 'Heroku') {
    return `https://${subdomain}.herokuapp.com/`
  }
}
