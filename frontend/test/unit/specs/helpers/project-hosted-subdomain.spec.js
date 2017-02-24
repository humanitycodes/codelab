import projectHostedSubdomain from '@helpers/project-hosted-subdomain'

describe('project-hosted-subdomain.js', () => {
  it('returns project name for GitHub Pages', () => {
    expect(projectHostedSubdomain('GitHub Pages', '', '', 'ProjName')).to.equal('ProjName')
  })

  it('removes special characters from email', () => {
    expect(projectHostedSubdomain(
      'Surge',
      'homer.j.simpson@nucular-plant.com',
      'project-key',
      'ProjectName'
    )).to.equal('homerjsimpsonproject-key')
  })

  it('restricts subdomain to 30 characters', () => {
    expect(projectHostedSubdomain(
      'Surge',
      'abcdefghijklmnopqrstuvwxyz0123456789@nucular-plant.com',
      'project-key-0123456789',
      'ProjectName'
    )).to.have.length.that.is.below(31)
  })
})
