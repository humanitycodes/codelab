import courseProjectCompletionRepoUrl from '@helpers/computed/course-project-completion-repo-url'

const assertRepoUrlWith = ({ course, projectCompletion, user, repoName }, expectation) => {
  courseProjectCompletionRepoUrl.__Rewire__('userByKey', () => user)
  courseProjectCompletionRepoUrl.__Rewire__('courseProjectCompletionRepoName', () => repoName)
  expect(
    courseProjectCompletionRepoUrl(course, {
      students: [{}],
      ...projectCompletion
    })
  ).to.equal(expectation)
  courseProjectCompletionRepoUrl.__ResetDependency__('userByKey')
  courseProjectCompletionRepoUrl.__ResetDependency__('courseProjectCompletionRepoName')
}

describe('@helpers/computed/course-project-completion-repo-url.js', () => {
  it('uses whole login and repo name', () => {
    assertRepoUrlWith({
      repoName: 'Project-Name',
      user: {
        github: {
          login: 'OctoCat'
        }
      }
    }, 'https://github.com/OctoCat/Project-Name')
  })
})
