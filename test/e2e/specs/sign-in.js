const db = require('../helpers/db').init()
const dgen = require('../helpers/data-generator')

const user = dgen.user()

module.exports = {
  before: browser => {
    db.createStudent(user)
  },

  after: browser => {
    db.close()
  },

  'Sign In links exist': browser => {
    browser
      .url(browser.globals.devServerURL)
      .waitForElementVisible('#container', 5000)

    browser.expect.element('.main-nav').to.be.present
    browser.expect.element('.main-nav a[href^=\'https://oauth.ais.msu.edu/oauth/authorize\']').to.be.present
    browser.expect.element('.main-nav a[href^=\'/email-sign-in\']').to.be.present
    browser.end()
  },

  'Successful Sign In with Email shows dashboard': browser => {
    browser
      .url(`${browser.globals.devServerURL}/email-sign-in`)
      .waitForElementVisible('button', 5000)
      .setValue('input[type=text]', user.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')
      .waitForElementVisible('.main-nav a[href^=\'/sign-out\']', 5000)
      .end()
  }
}
