// Explicitly add source map support until Nightwatch adds it natively
import 'source-map-support/register'

import db from '../helpers/db'
import dgen from '../helpers/data-generator'
import waitTime from '../const/wait-time'

const enrolledStudent = dgen.user()
enrolledStudent.fullName = 'Test Enrolled Student'

const hackerStudent = dgen.user()
hackerStudent.fullName = 'Test Hacker Student'

const lesson = dgen.lesson()
const course = dgen.course()

let enrolledStudentRecord, hackerStudentRecord

module.exports = {
  async before (browser, done) {
    await db.init()

    enrolledStudentRecord = await db.createStudent(enrolledStudent)
    hackerStudentRecord = await db.createStudent(hackerStudent)
    const lessonRecord = await db.createLesson(lesson)

    course.studentIds.push(enrolledStudentRecord.userId)
    course.lessonIds.push(lessonRecord.lessonId)
    await db.createCourse(course)

    done()
  },

  async after (browser, done) {
    await db.close()
    done()
  },

  'Enrolled student can access course and lesson': browser => {
    browser
      // Sign in
      .signInUser(enrolledStudentRecord.get())

      // Navigate to course list
      .assert.visible(`.main-nav a[href^='/courses']`)
      .click(`.main-nav a[href^='/courses']`)

      // Navigate to the course
      .waitForElementVisible(`a[href^='/courses/${course.courseKey}']:first-child`, waitTime)
      .click(`a[href^='/courses/${course.courseKey}']`)
      .waitForElementVisible('.lesson-graph-container', waitTime)

      // Make sure syllabus and lessons are visible
      .assert.containsText('.course-syllabus-container .rendered-content', course.syllabus)
      .assert.elementPresent(`a[href^='/courses/${course.courseKey}/lessons/${lesson.lessonKey}']`)

      // Navigate to the lesson
      .click(`a[href^='/courses/${course.courseKey}/lessons/${lesson.lessonKey}']`)
      .waitForElementVisible('.course-lesson-content', waitTime)

      // Make sure the lesson content is visible
      .assert.visible('.course-lesson-content .rendered-content')
      .assert.containsText('.course-lesson-content .rendered-content', lesson.content)

      // Close the browser and end the test
      .end()
  },

  'Student cannot access courses they are not enrolled in': browser => {
    browser
      // Sign in
      .signInUser(hackerStudentRecord.get())

      // Navigate to course list
      .assert.visible(`.main-nav a[href^='/courses']`)
      .click(`.main-nav a[href^='/courses']`)

      // No courses should be listed
      .waitForElementVisible('h1', waitTime)
      .assert.elementNotPresent(`a[href^='/courses/${course.courseKey}']`)

      // Try to navigate to course anyway
      .url(`${browser.launchUrl}/courses/${course.courseKey}`)
      .waitForElementVisible(`.main-nav`, waitTime)

      // Should not see course content
      .assert.elementNotPresent('.rendered-content')

      // Close the browser and end the test
      .end()
  },

  'Enrolled student cannot add or edit courses': browser => {
    browser
      // Sign in
      .signInUser(enrolledStudentRecord.get())

      // Navigate to course list
      .waitForElementVisible(`.main-nav a[href^='/courses']`, waitTime)
      .click(`.main-nav a[href^='/courses']`)
      .waitForElementVisible(`a[href^='/courses/${course.courseKey}']:first-child`, waitTime)

      // New and Edit links should not be present
      .assert.elementNotPresent(`a[href^='/courses/new']`)
      .assert.elementNotPresent(`a[href^='/courses/${course.courseKey}/edit']`)

      // Try to create a new course via URL
      .url(`${browser.launchUrl}/courses/new`)
      .waitForElementVisible(`.main-nav`, waitTime)

      // Should not see new course form
      .assert.elementNotPresent('.key-field')

      // Try to edit a course via URL
      .url(`${browser.launchUrl}/courses/${course.courseKey}`)
      .waitForElementVisible(`.main-nav`, waitTime)

      // Should not see editable course fields
      .assert.elementNotPresent('input')

      // Close the browser and end the test
      .end()
  }
}
