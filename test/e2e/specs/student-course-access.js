const db = require('../helpers/db').init()
const dgen = require('../helpers/data-generator')
const waitTime = 30000

const enrolledStudent = dgen.user()
enrolledStudent.fullName = 'Test Enrolled Student'

const hackerStudent = dgen.user()
hackerStudent.fullName = 'Test Hacker Student'

const instructor = dgen.user()
instructor.fullName = 'Test Instructor'

const lesson = dgen.lesson({ createdBy: instructor })

const course = dgen.course({ createdBy: instructor })
course.lessonKeys.push(lesson.key)
course.studentKeys.push(enrolledStudent.key)

module.exports = {
  before: browser => {
    db.createStudent(enrolledStudent)
    db.createStudent(hackerStudent)
    db.createInstructor(instructor)
    db.createLesson(lesson)
    db.createCourse(course)
  },

  after: browser => {
    db.close()
  },

  'Enrolled student can access course and lesson': browser => {
    browser
      // Sign in
      .url(`${browser.globals.devServerURL}/email-sign-in`)
      .waitForElementVisible('button', waitTime)
      .setValue('input[type=text]', enrolledStudent.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')

      // Navigate to course list
      .waitForElementVisible(`.main-nav a[href^='/courses']`, waitTime)
      .click(`.main-nav a[href^='/courses']`)
      .pause(200).refresh() // todo: Content below 'Courses' does not render w/o this. Can sometimes recreate manually.

      // Navigate to the course
      .waitForElementVisible(`a[href^='/courses/${course.key}']`, waitTime)
      .click(`a[href^='/courses/${course.key}']`)
      .waitForElementVisible('.lesson-graph-container', waitTime)

    // Make sure syllabus and lessons are visible
    browser.expect.element('.rendered-content').text.to.contain(course.syllabus)
    browser.expect.element(`a[href^='/courses/${course.key}/lessons/${lesson.key}']`).to.be.present

    browser
      // Navigate to the lesson
      .click(`a[href^='/courses/${course.key}/lessons/${lesson.key}']`)
      .pause(200).refresh() // todo: Sometimes lesson content doesn't render w/o refreshing first.
      .waitForElementVisible('.rendered-content', waitTime)

    // Make sure the lesson content is visible
    browser.expect.element('.rendered-content').text.to.contain(lesson.content)

    // Close the browser and end the test
    browser.end()
  },

  'Student cannot access courses they are not enrolled in': browser => {
    const baseURL = browser.globals.devServerURL

    browser
      // Sign in
      .url(`${baseURL}/email-sign-in`)
      .waitForElementVisible('button', waitTime)
      .setValue('input[type=text]', hackerStudent.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')

      // Navigate to course list
      .waitForElementVisible(`.main-nav a[href^='/courses']`, waitTime)
      .click(`.main-nav a[href^='/courses']`)
      .pause(200).refresh() // todo: Content below 'Courses' does not render w/o this. Can sometimes recreate manually.

    // No courses should be listed
    browser.expect.element(`a[href^='/courses/${course.key}']`).to.not.be.present

    // Try to navigate to course anyway
    browser.url(`${baseURL}/courses/${course.key}`)
      .waitForElementVisible(`.main-nav`, waitTime)

    // Should not see course content
    browser.expect.element('.rendered-content').to.not.be.present

    // Close the browser and end the test
    browser.end()
  },

  'Enrolled student cannot add or edit courses': browser => {
    const baseURL = browser.globals.devServerURL

    browser
      // Sign in
      .url(`${baseURL}/email-sign-in`)
      .waitForElementVisible('button', waitTime)
      .setValue('input[type=text]', enrolledStudent.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')

      // Navigate to course list
      .waitForElementVisible(`.main-nav a[href^='/courses']`, waitTime)
      .click(`.main-nav a[href^='/courses']`)
      .pause(200).refresh() // todo: Content below 'Courses' does not render w/o this. Can sometimes recreate manually.
      .waitForElementVisible(`a[href^='/courses/${course.key}']`, waitTime)

    // New and Edit links should not be present
    browser.expect.element(`a[href^='/courses/new']`).to.not.be.present
    browser.expect.element(`a[href^='/courses/${course.key}/edit']`).to.not.be.present

    // Try to create a new course via URL
    browser.url(`${baseURL}/courses/new`)
      .waitForElementVisible(`.main-nav`, waitTime)

    // Should not see new course form
    browser.expect.element('.key-field').to.not.be.present

    // Try to edit a course via URL
    browser.url(`${baseURL}/courses/${course.key}`)
      .waitForElementVisible(`.main-nav`, waitTime)

    // Should not see editable course fields
    browser.expect.element('input').to.not.be.present

    // Close the browser and end the test
    browser.end()
  }
}
