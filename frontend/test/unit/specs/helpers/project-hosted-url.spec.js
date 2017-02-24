import projectHostedUrl from '@helpers/project-hosted-url'

describe('project-hosted-url.js', () => {
  const userProfile = {
    email: 'homer.j.simpson@nuke-plant.com',
    github: {
      login: 'hjsimpson'
    }
  }

  const project = hosting => {
    return {
      '.key': 'project-key',
      hosting: hosting
    }
  }

  it('returns empty string when no project or completion', () => {
    expect(projectHostedUrl(userProfile, null, null, 'Project')).to.be.empty
  })

  it('returns correct hosted URL', () => {
    expect(projectHostedUrl(
      userProfile,
      project('Surge'),
      { hostedUrl: 'https://mydomain.com' },
      'Project-Name'
    )).to.equal('https://mydomain.com')
  })

  it('returns correct Surge URL', () => {
    expect(projectHostedUrl(
      userProfile,
      project('Surge'),
      { hostedUrl: '' },
      'Project-Name'
    )).to.equal('https://homerjsimpsonproject-key.surge.sh/')
  })

  it('returns correct Heroku URL', () => {
    expect(projectHostedUrl(
      userProfile,
      project('Heroku'),
      { hostedUrl: '' },
      'Project-Name'
    )).to.equal('https://homerjsimpsonproject-key.herokuapp.com/')
  })

  it('returns correct GitHub Pages URL', () => {
    expect(projectHostedUrl(
      userProfile,
      project('GitHub Pages'),
      { hostedUrl: '' },
      'Project-Name'
    )).to.equal('https://hjsimpson.github.io/Project-Name/')
  })
})
