// Explicitly add source map support until Nightwatch adds it natively
import 'source-map-support/register'

import db from '../helpers/db'
import dgen from '../helpers/data-generator'
import waitTime from '../const/wait-time'

let userRecord

module.exports = {
  async before (browser, done) {
    await db.init()
    userRecord = await db.createStudent(dgen.user())
    done()
  },

  async after (browser, done) {
    await db.close()
    done()
  },

  'Sign In link exist': browser => {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('.msu-standalone-signin-container', waitTime)
      .assert.elementPresent('a[href^=\'https://oauth.itservices.msu.edu/oauth/authorize\']')
      .end()
  },

  'Sign In with token shows dashboard': browser => {
    browser
      .signInUser(userRecord.get())
      .assert.containsText('#user-menu > header', userRecord.fullName)
      .end()
  }
}
