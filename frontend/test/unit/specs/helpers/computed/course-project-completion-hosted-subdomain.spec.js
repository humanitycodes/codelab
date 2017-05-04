import courseProjectCompletionHostedSubdomain from '@helpers/computed/course-project-completion-hosted-subdomain'

const assertSubdomainWith = ({ course, projectCompletion, user }, expectation) => {
  courseProjectCompletionHostedSubdomain.__Rewire__('userByKey', () => user)
  expect(
    courseProjectCompletionHostedSubdomain(course, {
      students: [{'.key': 'doesn\'t matter'}],
      ...projectCompletion
    })
  ).to.equal(expectation)
  courseProjectCompletionHostedSubdomain.__ResetDependency__('userByKey')
}

describe('@helpers/computed/course-project-completion-hosted-subdomain.js', () => {
  it('removes special characters from email', () => {
    assertSubdomainWith({
      projectCompletion: {
        lessonKey: 'project-key'
      },
      user: {
        email: 'homer.j.simpson@nucular-plant.com'
      }
    }, 'homerjsimpson-project-key')
  })

  it('restricts subdomain to 30 characters', () => {
    assertSubdomainWith({
      projectCompletion: {
        lessonKey: 'project-key-project-key-project-key-project-key'
      },
      user: {
        email: 'abcdefghijklmnopqrstuvwxyz0123456789@nucular-plant.com'
      }
    }, 'abcdefghijklmno-project-key-pr')
  })

  it('removes non-alphanumeric characters', () => {
    assertSubdomainWith({
      projectCompletion: {
        lessonKey: '-_/\\ABCabc123-_/\\'
      },
      user: {
        email: 'homer_simpson.1-1@nucular-plant.com'
      }
    }, 'homersimpson11-abcabc123')
  })

  it('uses lesson key as subdomain suffix', () => {
    assertSubdomainWith({
      projectCompletion: {
        projectKey: '-_/\\XYZxyz456-_/\\',
        lessonKey: '-_/\\ABCabc123-_/\\'
      },
      user: {
        email: 'homer_simpson.1-1@nucular-plant.com'
      }
    }, 'homersimpson11-abcabc123')
  })

  it('produces non-cryptic subdomains for real users and projects', () => {
    assertSubdomainWith({
      projectCompletion: {
        lessonKey: 'html-terminal-and-git'
      },
      user: {
        email: 'erik.gillespie@gmail.com'
      }
    }, 'erikgillespie-html-terminal-an')

    assertSubdomainWith({
      projectCompletion: {
        lessonKey: 'css-frameworks'
      },
      user: {
        email: 'katie@katiemfritz.com'
      }
    }, 'katie-css-frameworks')
  })
})
