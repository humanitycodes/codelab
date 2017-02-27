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
        projectKey: 'project-key'
      },
      user: {
        email: 'homer.j.simpson@nucular-plant.com'
      }
    }, 'homerjsimpsonproject-key')
  })

  it('restricts subdomain to 30 characters', () => {
    assertSubdomainWith({
      projectCompletion: {
        projectKey: 'project-key-project-key-project-key-project-key'
      },
      user: {
        email: 'abcdefghijklmnopqrstuvwxyz0123456789@nucular-plant.com'
      }
    }, 'abcdefghijklmnokey-project-key')
  })
})
