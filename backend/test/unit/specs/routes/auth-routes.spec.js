const routes = require(`${src}/routes/auth-routes`).config

describe('auth-routes', () => {
  function lookupRoute (method, path) {
    let route = routes.find(config => {
      return config.method === method && config.path === path
    })

    expect(route).to.exist

    return route
  }

  it('defines GET /msu/callback', () => {
    lookupRoute('GET', '/msu/callback')
  })

  it('defines GET /github/callback', () => {
    lookupRoute('GET', '/github/callback')
  })
})
