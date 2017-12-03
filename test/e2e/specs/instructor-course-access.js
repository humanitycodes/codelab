const randomatic = require('randomatic')
const datefns = require('date-fns')

const waitTime = 30000

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

    browser
      // Sign in
      .url(`${baseURL}/email-sign-in`)
      .waitForElementVisible('button', waitTime)
      .setValue('input[type=text]', instructor.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')

      // Navigate to lesson list
      .waitForElementVisible(`.main-nav a[href^='/lessons']`, waitTime)
      .click(`.main-nav a[href^='/lessons']`)
      .waitForElementVisible(`a[href^='/lessons/new']`, waitTime)

      // Create new lesson
      .click(`a[href^='/lessons/new']`)
      .waitForElementVisible('input[name=lesson-key]', waitTime)
      .setValue('select[name=lesson-category]', lessonKeyPrefix)
      .setValue('input[name=lesson-key]', lessonKeySuffix)
      .click('button')
      .waitForElementVisible('input[name=lesson-title]', waitTime)
      .assert.urlContains(`/lessons/${lesson.key}/edit`)

      // Edit lesson fields
      .setValue(`input[name=lesson-title]`, lesson.title)
      .setValue(`input[name=lesson-estimated-hours]`, lesson.estimatedHours)

      .setValue(`input[name=lesson-new-learning-objective]`, [
        Object.values(lesson.learningObjectives)[0].content,
        browser.Keys.ENTER
      ])

      .setValue(`input[name=lesson-prereq-query]`, prereqLesson.title)
      .waitForElementVisible('input[name=lesson-prereq-query] + .dropdown-results > .dropdown-result', waitTime)
      .click('input[name=lesson-prereq-query] + .dropdown-results > .dropdown-result')

      // Make sure the lesson is in the master list
      .click(`.main-nav a[href^='/lessons']`)
      .waitForElementVisible(`a[href^='/lessons/new']`, waitTime)
      .assert.visible(`a[href^='/lessons/${lesson.key}/edit']`)

      // View the recently edited lesson
      .click(`a[href^='/lessons/${lesson.key}/edit']`)
      .waitForElementVisible('input[name=lesson-title]', waitTime)
      .assert.value(`input[name=lesson-title]`, lesson.title)
      .assert.value(`input[name=lesson-estimated-hours]`, lesson.estimatedHours.toString())
      .assert.value(`input[name=lesson-new-learning-objective] + ol input`,
        Object.values(lesson.learningObjectives)[0].content)
      .assert.visible(`button[name=lesson-remove-prereq]`)

      // Close the browser and end the test
      .end()
  },

  'Instructor can create and edit course': browser => {
    const baseURL = browser.globals.devServerURL

    browser
      // Sign in
      .url(`${baseURL}/email-sign-in`)
      .waitForElementVisible('button', waitTime)
      .setValue('input[type=text]', instructor.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')

      // Navigate to course list
      .waitForElementVisible(`.main-nav a[href^='/courses']`, waitTime)
      .click(`.main-nav a[href^='/courses']`)
      .waitForElementVisible(`a[href^='/courses/new']`, waitTime)

      // Create new course
      .click(`a[href^='/courses/new']`)
      .waitForElementVisible('input[name=course-number]', waitTime)
      .setValue('select[name=course-prefix]', courseKeyDep)
      .setValue('input[name=course-number]', courseKeyNum)
      .setValue('select[name=course-semester]', courseKeySem)
      .setValue('input[name=course-year]', courseKeyYear)
      .setValue('input[name=course-section]', courseKeySec)
      .waitForElementPresent('button:not([DISABLED])', waitTime)
      .click('button:not([DISABLED])')
      .waitForElementVisible('input[name=course-title]', waitTime)
      .assert.urlContains(`/courses/${course.key}/edit`)

      // Edit course fields
      .setValue(`input[name=course-title]`, course.title)
      .setValue(`input[name=course-credits]`, course.credits)

      // setValue sends keystrokes, so format the dates in the order you would type a date
      .setValue(`input[name=course-start-date]`, datefns.format(course.startDate, 'MMDDYYYY'))
      .setValue(`input[name=course-end-date]`, datefns.format(course.endDate, 'MMDDYYYY'))

      // Type student email and press Enter (\n) to enroll
      .setValue(`input[name=course-student-email]`, student.email + '\n')
      .waitForElementVisible(`a[name='student-${student.email}']`, waitTime)

      .setValue(`input[name=course-lesson-query]`, lesson.title)
      .waitForElementVisible('input[name=course-lesson-query] + .dropdown-results > .dropdown-result', waitTime)
      .click('input[name=course-lesson-query] + .dropdown-results > .dropdown-result')

      // Make sure the course is in the master list
      .click(`.main-nav a[href^='/courses']`)
      .waitForElementVisible(`a[href^='/courses/new']`, waitTime)
      .assert.visible(`a[href^='/courses/${course.key}/edit']`)

      // View the recently edited course
      .click(`a[href^='/courses/${course.key}/edit']`)
      .waitForElementVisible('input[name=course-title]', waitTime)
      .assert.value(`input[name=course-title]`, course.title)
      .assert.value(`input[name=course-credits]`, course.credits.toString())
      .assert.value(`input[name=course-start-date]`, datefns.format(course.startDate, 'YYYY-MM-DD'))
      .assert.value(`input[name=course-end-date]`, datefns.format(course.endDate, 'YYYY-MM-DD'))
      .assert.visible(`button[name=course-remove-student]`)
      .assert.visible(`button[name=course-remove-lesson]`)

      // Close the browser and end the test
      .end()
  }
}
