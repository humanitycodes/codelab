import uuid from 'uuid'

import * as db from '../helpers/db'

module.exports = {
  'Sign In links exist': browser => {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#container', 5000)

    browser.expect.element('.main-nav').to.be.present
    browser.expect.element('.main-nav a[href^=\'https://oauth.ais.msu.edu/oauth/authorize\']').to.be.present
    browser.expect.element('.main-nav a[href^=\'/email-sign-in\']').to.be.present
    browser.end()
  },
  'Successful Sign In with Email shows dashboard': browser => {
    let userId = uuid.v4()
    let user = {
      uid: userId,
      email: `${userId}@test.com`,
      fullName: 'Test User'
    }

    db.init()
    db.createUser(user)

    browser.url(browser.globals.devServerURL)
      .waitForElementVisible('.main-nav a[href^=\'/email-sign-in\']', 5000)
      .click('.main-nav a[href^=\'/email-sign-in\']')
      .waitForElementVisible('button', 5000)
      .setValue('input[type=text]', user.email)
      .setValue('input[type=password]', db.USER_PASSWORD)
      .click('button')
      .waitForElementVisible('.main-nav a[href^=\'/sign-out\']', 5000)
      .end(() => {
        db.destroyUser(user).then(() => {
          db.close()
        })
      })
  }
}
