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

  'Users can change their name': browser => {
    const newName = 'Ada Lovelace'

    browser
      // Sign in
      .signInUser(userRecord.get())

      // Navigate to user profile page
      .assert.visible('#user-menu > header > a')
      .click('#user-menu > header > a')
      .waitForElementVisible('a[href$="/profile"]', waitTime)
      .click('a[href$="/profile"]')

      // Change the user's name
      .waitForElementVisible('input[name="user-full-name"]', waitTime)
      .setValue('input[name="user-full-name"]', newName)

      // Save the form
      .click('button[name=done-button]:first-child')

      // Check for the success message
      .waitForElementVisible('.success', waitTime)

      // Make sure the menu shows the new name
      .assert.containsText('#user-menu > header', newName)

      // Close the browser and end the test
      .end()
  }
}
