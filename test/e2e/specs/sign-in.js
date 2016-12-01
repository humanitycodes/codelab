import Hapi from 'hapi'

module.exports = {
  'Verify Sign In link exists': browser => {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#container', 5000)

    browser.expect.element('.main-nav').to.be.present
    browser.expect.element('.main-nav a[href^=\'https://oauth.ais.msu.edu/oauth/authorize\']').to.be.present
    browser.expect.element('.main-nav a[href^=\'https://oauth.ais.msu.edu/oauth/authorize\']').text.to.match(/Sign in/i)
    browser.end()
  },
  'Successful Sign In shows dashboard': browser => {
    const devServer = browser.globals.devServerURL

    const server = new Hapi.Server()

    server.connection({
      host: '0.0.0.0',
      port: 7777
    })

    server.route({
      method: 'GET',
      path: '/',
      handler: (request, reply) => {
        const response = reply(`<form action="${devServer}/auth/msu/callback" method="post"><input type="submit"></form>`)
        response.type('text/html')
      }
    })

    server.route({
      method: 'POST',
      path: '/oauth/token',
      handler: (request, reply) => {
        console.error('QUERY:', request.query)
        reply({
          token_type: 'Bearer',
          access_token: 'a-c-c-e-s-s-t-o-k-e-n'
        })
      }
    })

    server.start(error => {
      if (error) throw error

      console.log('Server running at:', server.info.uri)

      browser
        .url(server.info.uri)
        .waitForElementVisible('input[type=submit]', 5000)

      browser.click('input[type=submit]')
      browser.end()

      server.stop()
    })
  }
}
