import userByKey from '../finders/user-by-key'
import courseProjectCompletionRepoName from './course-project-completion-repo-name'

export default (course, projectCompletion) => {
  const user = userByKey(projectCompletion.students[0]['.key'])
  const githubUsername = user.github.login
  const repoName = courseProjectCompletionRepoName(course, projectCompletion)
  return [
    'https://github.com/',
    githubUsername,
    '/',
    repoName
  ].join('')
}
