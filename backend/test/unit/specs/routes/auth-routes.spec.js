const routes = require(`${src}/routes/auth-routes`).config

describe('auth-routes', () => {
  it('routes GET /msu/callback', () => {
    expect(routes).to.resolve('GET', '/msu/callback')
  })

  it('routes GET /github/callback', () => {
    expect(routes).to.resolve('GET', '/github/callback')
  })
})
