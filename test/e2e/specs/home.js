// Explicitly add source map support until Nightwatch adds it natively
import 'source-map-support/register'

import waitTime from '../const/wait-time'

export default {
  'default e2e tests': browser => {
    browser
      .url(browser.launchUrl)
      .waitForElementVisible('.msu-standalone-signin-container', waitTime)
      .assert.elementPresent('h1')
      .assert.elementPresent('.msu-standalone-signin-button')
      .end()
  }
}
