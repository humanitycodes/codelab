// Explicitly add source map support until Nightwatch adds it natively
import 'source-map-support/register'

import db from '../helpers/db'
import dgen from '../helpers/data-generator'
import waitTime from '../const/wait-time'

const enrolledStudent = dgen.user()
enrolledStudent.fullName = 'Test Enrolled Student'

const hackerStudent = dgen.user()
hackerStudent.fullName = 'Test Hacker Student'

const instructor = dgen.user()
instructor.fullName = 'Test Instructor'

const lesson = dgen.lesson()

const course = dgen.course()
course.lessonIds.push(lesson.lessonId)
course.studentIds.push(enrolledStudent.userId)

module.exports = {
  '@disabled': true,

  async before (browser, done) {
    await db.init()
    await db.createStudent(enrolledStudent)
    await db.createStudent(hackerStudent)
    await db.createInstructor(instructor)
    await db.createLesson(lesson)
    await db.createCourse(course)
  },

  async after (browser, done) {
    await db.close()
    done()
  },

  'Enrolled student can access course and lesson': browser => {
    browser
      // Sign in
      .url(`${browser.launchUrl}/email-sign-in`)
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
      .assert.containsText('.rendered-content', course.syllabus)
      .assert.elementPresent(`a[href^='/courses/${course.key}/lessons/${lesson.key}']`)

      // Navigate to the lesson
      .click(`a[href^='/courses/${course.key}/lessons/${lesson.key}']`)
      .pause(200).refresh() // todo: Sometimes lesson content doesn't render w/o refreshing first.
      .waitForElementVisible('.rendered-content', waitTime)

      // Make sure the lesson content is visible
      .assert.containsText('.rendered-content', lesson.content)

      // Close the browser and end the test
      .end()
  },

  'Student cannot access courses they are not enrolled in': browser => {
    const baseURL = browser.launchUrl

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
      .assert.elementNotPresent(`a[href^='/courses/${course.key}']`)

      // Try to navigate to course anyway
      .url(`${baseURL}/courses/${course.key}`)
      .waitForElementVisible(`.main-nav`, waitTime)

      // Should not see course content
      .assert.elementNotPresent('.rendered-content')

      // Close the browser and end the test
      .end()
  },

  'Enrolled student cannot add or edit courses': browser => {
    const baseURL = browser.launchUrl

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
      .assert.elementNotPresent(`a[href^='/courses/new']`)
      .assert.elementNotPresent(`a[href^='/courses/${course.key}/edit']`)

      // Try to create a new course via URL
      .url(`${baseURL}/courses/new`)
      .waitForElementVisible(`.main-nav`, waitTime)

      // Should not see new course form
      .assert.elementNotPresent('.key-field')

      // Try to edit a course via URL
      .url(`${baseURL}/courses/${course.key}`)
      .waitForElementVisible(`.main-nav`, waitTime)

      // Should not see editable course fields
      .assert.elementNotPresent('input')

      // Close the browser and end the test
      .end()
  }
}
