const db = require('../helpers/db').init()
const dgen = require('../helpers/data-generator')

const student = dgen.user()
student.fullName = 'Test Student'

const instructor = dgen.user()
instructor.fullName = 'Test Instructor'

const lesson = dgen.lesson({ createdBy: instructor })
const [lessonKeyPrefix, lessonKeySuffix] = lesson.key.split('-')

module.exports = {
  before: browser => {
    db.createStudent(student)
    db.createInstructor(instructor)
    db.cleanupLater(db.destroyLesson, [lesson])
  },

  after: browser => {
    db.close()
  },

  'Instructors can maintain lessons': browser => {
    const baseURL = browser.globals.devServerURL

    browser.url(baseURL)
      // Sign in
      .waitForElementVisible(`.main-nav a[href^='/email-sign-in']`, 5000)
      .click(`.main-nav a[href^='/email-sign-in']`)
      .waitForElementVisible('button', 5000)
      .setValue('input[type=text]', instructor.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')

      // Navigate to lesson list
      .waitForElementVisible(`.main-nav a[href^='/lessons']`, 5000)
      .click(`.main-nav a[href^='/lessons']`)
      .waitForElementVisible(`a[href^='/lessons/new']`, 5000)

      // Create new lesson
      .click(`a[href^='/lessons/new']`)
      .waitForElementVisible('select', 5000)
      .setValue('select', lessonKeyPrefix)
      .setValue('input', lessonKeySuffix)
      .click('button')
      .waitForElementVisible(`button.danger`, 5000)
      .assert.urlContains(`/lessons/${lesson.key}/edit`)

      // Edit lesson fields

    // Close the browser and end the test
    browser.end()
  }
}
