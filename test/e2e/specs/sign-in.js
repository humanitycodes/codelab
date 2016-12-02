import firebase from 'firebase-admin'
import uuid from 'uuid'
import chai from 'chai'

import * as firebaseSettings from '../../../backend/src/firebase-settings'

const PASSWORD = 'toomanysecrets'

function createUser (user) {
  let db = firebase.database()
  return Promise.all([
    firebase.auth().createUser({
      uid: user.uid,
      email: user.email,
      emailVerified: true,
      displayName: user.fullName,
      password: PASSWORD
    }),
    db.ref('users').child(user.uid).set({
      email: user.email,
      fullName: user.fullName
    }),
    db.ref('roles').child(user.uid).set({
      instructor: false
    })
  ])
}

function destroyUser (user) {
  if (!user) return Promise.resolve()

  let db = firebase.database()
  return Promise.all([
    db.ref('roles').child(user.uid).remove(),
    db.ref('users').child(user.uid).remove(),
    firebase.auth().deleteUser(user.uid)
  ])
}

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
    const devServer = browser.globals.devServerURL

    firebase.initializeApp(firebaseSettings.appConfig)

    let userId = uuid.v4()
    let user = {
      uid: userId,
      email: `${userId}@test.com`,
      fullName: 'Test User'
    }

    createUser(user)

    browser.url(devServer)
      .waitForElementVisible('.main-nav a[href^=\'/email-sign-in\']', 5000)
      .click('.main-nav a[href^=\'/email-sign-in\']')
      .waitForElementVisible('button', 5000)
      .setValue('input[type=text]', user.email)
      .setValue('input[type=password]', PASSWORD)
      .click('button')
      .waitForElementVisible('.main-nav a[href^=\'/sign-out\']', 5000)
      .end(() => {
        destroyUser(user).then(() => {
          firebase.app().delete()
        })
      })
  }
}
