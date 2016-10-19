import env from '@env'

describe('*.env.js', () => {
  it('has an MSU OAuth Client ID', () => {
    expect(env).to.have.property('msuAuthClientId')
  })

  it('has a GitHub OAuth Client ID', () => {
    expect(env).to.have.property('githubAuthClientId')
  })
})
