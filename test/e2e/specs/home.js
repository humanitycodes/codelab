// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
const waitTime = 30000

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('.msu-standalone-signin-container', waitTime)
    browser.expect.element('h1').to.be.present
    browser.expect.element('.msu-standalone-signin-button').to.be.present
    browser.end()
  }
}
