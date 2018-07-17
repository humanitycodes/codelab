// Explicitly add source map support until Nightwatch adds it natively
import 'source-map-support/register'

import db from '../helpers/db'
import dgen from '../helpers/data-generator'
import waitTime from '../const/wait-time'

const user = dgen.user()

export default {
  async before (browser, done) {
    await db.init()
    const userRecord = await db.createStudent(user)
    console.log('Created user', userRecord.userId)
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

  'Successful Sign In with Email shows dashboard': browser => {
    browser
      .url(`${browser.launchUrl}/email-sign-in`)
      .waitForElementVisible('button', waitTime)
      .setValue('input[type=text]', user.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')
      .waitForElementVisible('.main-nav a[href^=\'/sign-out\']', waitTime)
      .end()
  }
}
