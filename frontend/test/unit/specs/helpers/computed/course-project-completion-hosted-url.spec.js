import courseProjectCompletionHostedUrl from '@helpers/computed/course-project-completion-hosted-url'

const assertHostedUrlWith = ({ course, projectCompletion, user, lesson, subdomain, repoName }, expectation) => {
  courseProjectCompletionHostedUrl.__Rewire__('userByKey', () => user)
  courseProjectCompletionHostedUrl.__Rewire__('lessonByKey', () => lesson)
  courseProjectCompletionHostedUrl.__Rewire__('courseProjectCompletionHostedSubdomain', () => subdomain)
  courseProjectCompletionHostedUrl.__Rewire__('courseProjectCompletionRepoName', () => repoName)
  expect(
    courseProjectCompletionHostedUrl(course, projectCompletion)
  ).to.equal(expectation)
  courseProjectCompletionHostedUrl.__ResetDependency__('userByKey')
  courseProjectCompletionHostedUrl.__ResetDependency__('lessonByKey')
  courseProjectCompletionHostedUrl.__ResetDependency__('courseProjectCompletionHostedSubdomain')
  courseProjectCompletionHostedUrl.__ResetDependency__('courseProjectCompletionRepoName')
}

describe('@helpers/computed/course-project-completion-hosted-url.js', () => {
  const user = {
    email: 'homer.j.simpson@nuke-plant.com',
    github: {
      login: 'hjsimpson'
    }
  }

  it('returns empty string when no project or completion', () => {
    assertHostedUrlWith({}, '')
  })

  it('returns correct hosted URL', () => {
    assertHostedUrlWith({
      user,
      projectCompletion: {
        hostedUrl: 'https://mydomain.com'
      }
    }, 'https://mydomain.com')
  })

  it('returns correct Surge URL', () => {
    assertHostedUrlWith({
      user,
      lesson: {
        projects: [{ hosting: 'Surge' }]
      },
      projectCompletion: {},
      subdomain: 'homerjsimpsonsome-project-key'
    }, 'https://homerjsimpsonsome-project-key.surge.sh/')
  })

  it('returns correct Heroku URL', () => {
    assertHostedUrlWith({
      user,
      lesson: {
        projects: [{ hosting: 'Heroku' }]
      },
      projectCompletion: {},
      subdomain: 'homerjsimpsonsome-project-key'
    }, 'https://homerjsimpsonsome-project-key.herokuapp.com/')
  })

  it('returns correct GitHub Pages URL', () => {
    assertHostedUrlWith({
      user,
      lesson: {
        projects: [{ hosting: 'GitHub Pages' }]
      },
      projectCompletion: { students: [{ '.key': '' }] },
      subdomain: 'homerjsimpsonsome-project-key',
      repoName: 'Project-Name'
    }, 'https://hjsimpson.github.io/Project-Name/')
  })
})
