const db = require('../helpers/db').init()
const dgen = require('../helpers/data-generator')

const student1 = dgen.user()
student1.fullName = 'Test Student One'

const instructor = dgen.user()
instructor.fullName = 'Test Instructor'

const lesson = dgen.lesson({ createdBy: instructor })

const course = dgen.course({ createdBy: instructor })
course.lessonKeys.push(lesson.key)
course.studentKeys.push(student1.key)

module.exports = {
  before: browser => {
    db.createStudent(student1)
    db.createInstructor(instructor)
    db.createLesson(lesson)
    db.createCourse(course)
  },

  after: browser => {
    Promise.all([
      db.destroyUser(student1),
      db.destroyUser(instructor),
      db.destroyCourse(course),
      db.destroyLesson(lesson)
    ]).then(() => {
      db.close()
    })
  },

  'Enrolled student can access course and lesson': browser => {
    browser.url(browser.globals.devServerURL)
      // Sign in
      .waitForElementVisible(`.main-nav a[href^='/email-sign-in']`, 5000)
      .click(`.main-nav a[href^='/email-sign-in']`)
      .waitForElementVisible('button', 5000)
      .setValue('input[type=text]', student1.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')

      // Navigate to course list
      .waitForElementVisible(`.main-nav a[href^='/courses']`, 5000)
      .click(`.main-nav a[href^='/courses']`)
      .pause(200).refresh() // todo: Content below 'Courses' does not render w/o this. Can sometimes recreate manually.

      // Navigate to the course
      .waitForElementVisible(`a[href^='/courses/${course.key}']`, 5000)
      .click(`a[href^='/courses/${course.key}']`)
      .waitForElementVisible('.lesson-graph-container', 5000)

    // Make sure syllabus and lessons are visible
    browser.expect.element('.rendered-content').text.to.contain(course.syllabus)
    browser.expect.element(`a[href^='/courses/${course.key}/lessons/${lesson.key}']`).to.be.present

    browser
      // Navigate to the lesson
      .click(`a[href^='/courses/${course.key}/lessons/${lesson.key}']`)
      .pause(200).refresh() // todo: Sometimes lesson content doesn't render w/o refreshing first.
      .waitForElementVisible('.rendered-content', 5000)

    // Make sure the lesson content is visible
    browser.expect.element('.rendered-content').text.to.contain(lesson.content)

    // Close the browser and end the test
    browser.end()
  }
}
