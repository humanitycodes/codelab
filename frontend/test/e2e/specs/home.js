// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#container', 5000)
    browser.expect.element('h1').text.to.contain('Welcome')
    browser.expect.element('.main-nav').to.be.present
    browser.end()
  }
}
