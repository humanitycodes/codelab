import uuid from 'uuid'

import * as db from '../helpers/db'

let userId = uuid.v4()
let user = {
  uid: userId,
  email: `${userId}@test.com`,
  fullName: 'Test User'
}

module.exports = {
  before: browser => {
    db.init()
    db.createUser(user)
  },

  after: browser => {
    db.destroyUser(user)
    .then(() => {
      db.close()
    })
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
    browser.url(browser.globals.devServerURL)
      .waitForElementVisible('.main-nav a[href^=\'/email-sign-in\']', 5000)
      .click('.main-nav a[href^=\'/email-sign-in\']')
      .waitForElementVisible('button', 5000)
      .setValue('input[type=text]', user.email)
      .setValue('input[type=password]', db.USER_PASSWORD)
      .click('button')
      .waitForElementVisible('.main-nav a[href^=\'/sign-out\']', 5000)
      .end()
  }
}
