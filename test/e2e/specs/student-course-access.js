const uuid = require('uuid')

const db = require('../helpers/db').init()

let studentId = uuid.v4()
let student = {
  uid: studentId,
  email: `${studentId}@test.com`,
  fullName: 'Test Student'
}

let instructorId = uuid.v4()
let instructor = {
  uid: instructorId,
  email: `${instructorId}@test.com`,
  fullName: 'Test Instructor'
}

let lessonKey = uuid.v4()
let lesson = {
  key: lessonKey,
  createdBy: instructorId,
  title: 'Test Title',
  estimatedHours: 4,
  learningObjectives: {},
  content: 'Test Content',
  notes: 'Test Lesson Notes',
  learningObjectives: {
    [`${uuid.v4()}`]: {
      content: 'Learn something'
    }
  }
}

let courseKey = uuid.v4()
let course = {
  key: courseKey,
  createdBy: instructorId,
  title: 'Test Course',
  credits: 2,
  syllabus: 'Test Syllabus',
  startDate: new Date('Mon Dec 31 2007 23:59:59 GMT-0500 (EST)').getTime(),
  endDate: new Date('Mon Dec 31 2087 23:59:59 GMT-0500 (EST)').getTime(),
  notes: 'Test Course Notes',
  lessonKeys: {
    [`${lessonKey}`]: true
  },
  studentKeys: {
    [`${studentId}`]: true
  }
}

module.exports = {
  before: browser => {
    db.createStudent(student)
    db.createInstructor(instructor)
    db.createLesson(lesson)
    db.createCourse(course)
  },

  after: browser => {
    Promise.all([
      db.destroyUser(student),
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
      .setValue('input[type=text]', student.email)
      .setValue('input[type=password]', db.getDefaultPassword())
      .click('button')

      // Navigate to course list
      .waitForElementVisible(`.main-nav a[href^='/courses']`, 5000)
      .click(`.main-nav a[href^='/courses']`)
      .pause(200).refresh() // todo: Content below 'Courses' does not render w/o this. Can sometimes recreate manually.

      // Navigate to the course
      .waitForElementVisible(`a[href^='/courses/${courseKey}']`, 5000)
      .click(`a[href^='/courses/${courseKey}']`)
      .waitForElementVisible('.lesson-graph-container', 5000)

    // Make sure syllabus and lessons are visible
    //browser.expect.element('.rendered-content').text.to.contain(course.syllabus)
    browser.expect.element(`a[href^='/courses/${courseKey}/lessons/${lessonKey}']`).to.be.present

    browser
      // Navigate to the lesson
      .click(`a[href^='/courses/${courseKey}/lessons/${lessonKey}']`)
      .pause(200).refresh() // todo: Sometimes lesson content doesn't render w/o refreshing first.
      .waitForElementVisible('.rendered-content', 5000)

    // Make sure the lesson content is visible
    browser.expect.element('.rendered-content').text.to.contain(lesson.content)

    // Close the browser and end the test
    browser.end()
  }
}
