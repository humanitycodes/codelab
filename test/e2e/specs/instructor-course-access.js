const randomatic = require('randomatic')

const db = require('../helpers/db').init()
const dgen = require('../helpers/data-generator')

const student = dgen.user()
student.fullName = 'Test Student'

const instructor = dgen.user()
instructor.fullName = 'Test Instructor'

const prereqLesson = dgen.lesson({
  createdBy: instructor,
  title: `Prereq Title ${randomatic('a', 10)}`
})

const lesson = dgen.lesson({ createdBy: instructor })
const [lessonKeyPrefix, lessonKeySuffix] = lesson.key.split('-')

const courseKeyDep = 'MI'
const courseKeyNum = randomatic('0', 3)
const courseKeySem = 'FS'
const courseKeyYear = randomatic('0', 2)
const courseKeySec = randomatic('0', 3)
const courseKey = `${courseKeyDep}-${courseKeyNum}-${courseKeySem}${courseKeyYear}-${courseKeySec}`
const course = dgen.course({
  key: courseKey,
  createdBy: instructor
})

module.exports = {
  before: browser => {
    db.createStudent(student)
    db.createInstructor(instructor)
    db.createLesson(prereqLesson)
    db.cleanupLater(db.destroyLesson, [lesson])
    db.cleanupLater(db.destroyCourse, [course])
  },

  after: browser => {
    db.close()
  },

  'Instructor can create and edit lesson': browser => {
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
      .waitForElementVisible('input[name=lesson-key]', 5000)
      .setValue('select[name=lesson-category]', lessonKeyPrefix)
      .setValue('input[name=lesson-key]', lessonKeySuffix)
      .click('button')
      .waitForElementVisible('input[name=lesson-title]', 5000)
      .assert.urlContains(`/lessons/${lesson.key}/edit`)

      // Edit lesson fields
      .setValue(`input[name=lesson-title]`, lesson.title)
      .setValue(`input[name=lesson-estimated-hours]`, lesson.estimatedHours)
      .setValue(`textarea[name=lesson-content]`, lesson.content)
      .setValue(`textarea[name=lesson-notes]`, lesson.notes)
      .setValue(`input[name=lesson-new-learning-objective]`, [
        Object.values(lesson.learningObjectives)[0].content,
        browser.Keys.ENTER
      ])
      .setValue(`input[name=lesson-prereq-query]`, prereqLesson.title)
      .waitForElementVisible('input[name=lesson-prereq-query] + .dropdown-results > .dropdown-result', 5000)
      .click('input[name=lesson-prereq-query] + .dropdown-results > .dropdown-result')

      // Make sure the lesson is in the master list
      .click(`.main-nav a[href^='/lessons']`)
      .waitForElementVisible(`a[href^='/lessons/new']`, 5000)
      .assert.visible(`a[href^='/lessons/${lesson.key}/edit']`)

      // View the recently edited lesson
      .click(`a[href^='/lessons/${lesson.key}/edit']`)
      .waitForElementVisible('input[name=lesson-title]', 5000)
      .assert.value(`input[name=lesson-title]`, lesson.title)
      .assert.value(`input[name=lesson-estimated-hours]`, lesson.estimatedHours.toString())
      .assert.value(`textarea[name=lesson-content]`, lesson.content)
      .assert.value(`textarea[name=lesson-notes]`, lesson.notes)
      .assert.value(`input[name=lesson-new-learning-objective] + ol input`,
        Object.values(lesson.learningObjectives)[0].content)
      .assert.visible(`button[name=lesson-remove-prereq]`)

      // Close the browser and end the test
      .end()
  },

  'Instructor can create and edit course': browser => {
    const baseURL = browser.globals.devServerURL

    browser.url(baseURL)
      // Sign in
      .waitForElementVisible(`.main-nav a[href^='/email-sign-in']`, 5000)
      .click(`.main-nav a[href^='/email-sign-in']`)
      .waitForElementVisible('button', 5000)
      .setValue('input[type=text]', instructor.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')

      // Navigate to course list
      .waitForElementVisible(`.main-nav a[href^='/courses']`, 5000)
      .click(`.main-nav a[href^='/courses']`)
      .waitForElementVisible(`a[href^='/courses/new']`, 5000)

      // Create new course
      .click(`a[href^='/courses/new']`)
      .waitForElementVisible('input[name=course-number]', 5000)
      .setValue('select[name=course-prefix]', courseKeyDep)
      .setValue('input[name=course-number]', courseKeyNum)
      .setValue('select[name=course-semester]', courseKeySem)
      .setValue('input[name=course-year]', courseKeyYear)
      .setValue('input[name=course-section]', courseKeySec)
      .waitForElementPresent('button:not([DISABLED])', 5000)
      .click('button:not([DISABLED])')
      .waitForElementVisible('input[name=course-title]', 5000)
      .assert.urlContains(`/courses/${course.key}/edit`)
/*
      // Edit course fields
      .setValue(`input[name=lesson-title]`, lesson.title)
      .setValue(`input[name=lesson-estimated-hours]`, lesson.estimatedHours)
      .setValue(`textarea[name=lesson-content]`, lesson.content)
      .setValue(`textarea[name=lesson-notes]`, lesson.notes)
      .setValue(`input[name=lesson-new-learning-objective]`, [
        Object.values(lesson.learningObjectives)[0].content,
        browser.Keys.ENTER
      ])
      .setValue(`input[name=lesson-prereq-query]`, prereqLesson.title)
      .waitForElementVisible('input[name=lesson-prereq-query] + .dropdown-results > .dropdown-result', 5000)
      .click('input[name=lesson-prereq-query] + .dropdown-results > .dropdown-result')

      // Make sure the course is in the master list
      .click(`.main-nav a[href^='/lessons']`)
      .waitForElementVisible(`a[href^='/lessons/new']`, 5000)
      .assert.visible(`a[href^='/lessons/${lesson.key}/edit']`)

      // View the recently edited course
      .click(`a[href^='/lessons/${lesson.key}/edit']`)
      .waitForElementVisible('input[name=lesson-title]', 5000)
      .assert.value(`input[name=lesson-title]`, lesson.title)
      .assert.value(`input[name=lesson-estimated-hours]`, lesson.estimatedHours.toString())
      .assert.value(`textarea[name=lesson-content]`, lesson.content)
      .assert.value(`textarea[name=lesson-notes]`, lesson.notes)
      .assert.value(`input[name=lesson-new-learning-objective] + ol input`,
        Object.values(lesson.learningObjectives)[0].content)
      .assert.visible(`button[name=lesson-delete-prereq]`)
*/
      // Close the browser and end the test
      .end()
  }
}
