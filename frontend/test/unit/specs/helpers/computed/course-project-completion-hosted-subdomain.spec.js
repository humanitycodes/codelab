import courseProjectCompletionHostedSubdomain from '@helpers/computed/course-project-completion-hosted-subdomain'
import store from '@state/store'

describe('@helpers/computed/course-project-completion-hosted-subdomain.js', () => {
  const user = {
    userId: 11,
    email: 'homer.j.simpson@nuke-plant.com',
    githubLogin: 'hjsimpson'
  }

  const course = {
    courseId: 31,
    courseKey: 'MI-449-SS18-123'
  }

  const lesson = {
    lessonId: 21,
    lessonKey: 'html-intro',
    projectHosting: 'Surge'
  }

  const completion = {
    courseId: course.courseId,
    studentUserId: user.userId,
    lessonId: lesson.lessonId
  }

  before(() => {
    store.commit('SET_ALL_LESSONS', [lesson])
    store.commit('SET_ALL_USERS', [user])
    store.commit('SET_CURRENT_USER', user)
  })

  after(() => {
    store.commit('SET_ALL_LESSONS', [])
    store.commit('SET_ALL_USERS', [])
    store.commit('SET_CURRENT_USER', null)
  })

  it('removes special characters from GitHub login', () => {
    user.githubLogin = 'homer.j.simpson'
    const domain = courseProjectCompletionHostedSubdomain(completion)
    expect(domain).to.equal('homerjsimpson-html-intro')
  })

  it('restricts subdomain to 30 characters', () => {
    user.githubLogin = 'abcdefghijklmnopqrstuvwxyz0123456789'
    lesson.lessonKey = 'project-key-project-key-project-key-project-key'
    const domain = courseProjectCompletionHostedSubdomain(completion)
    expect(domain).to.equal('abcdefghijklmno-project-key-pr')
  })

  it('removes non-alphanumeric characters', () => {
    user.githubLogin = 'homer_simpson.1-1'
    lesson.lessonKey = '-_/\\ABCabc123-_/\\'
    const domain = courseProjectCompletionHostedSubdomain(completion)
    expect(domain).to.equal('homersimpson11-abcabc123')
  })

  it('does not allow trailing special characters', () => {
    user.githubLogin = 'erik.l.gillespie'
    lesson.lessonKey = 'css-frameworks-bootstrap'
    const domain = courseProjectCompletionHostedSubdomain(completion)
    expect(domain).to.equal('eriklgillespie-css-frameworks')
  })

  it('produces non-cryptic subdomains for real users and projects', () => {
    user.githubLogin = 'erik.gillespie'
    lesson.lessonKey = 'html-terminal-and-git'
    const domain1 = courseProjectCompletionHostedSubdomain(completion)
    expect(domain1).to.equal('erikgillespie-html-terminal-an')

    user.githubLogin = 'katie'
    lesson.lessonKey = 'css-frameworks'
    const domain2 = courseProjectCompletionHostedSubdomain(completion)
    expect(domain2).to.equal('katie-css-frameworks')
  })
})
