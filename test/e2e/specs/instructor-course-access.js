// Explicitly add source map support until Nightwatch adds it natively
import 'source-map-support/register'

import randomatic from 'randomatic'
import moment from 'moment'
import db from '../helpers/db'
import dgen from '../helpers/data-generator'
import waitTime from '../const/wait-time'

const student = dgen.user()
student.fullName = 'Test Student'

const instructor = dgen.user()
instructor.fullName = 'Test Instructor'

const prereqLesson = dgen.lesson({
  title: `Prereq Title ${randomatic('a', 10)}`
})

const lesson = dgen.lesson()
const [lessonKeyPrefix, lessonKeySuffix] = lesson.lessonKey.split('-')

const courseKeyDep = 'MI'
const courseKeyNum = randomatic('0', 3)
const courseKeySem = 'FS'
const courseKeyYear = randomatic('0', 2)
const courseKeySec = randomatic('0', 3)
const courseKey = `${courseKeyDep}-${courseKeyNum}-${courseKeySem}${courseKeyYear}-${courseKeySec}`
const course = dgen.course({ courseKey })

let instructorRecord

export default {
  async before (browser, done) {
    await db.init()
    instructorRecord = await db.createInstructor(instructor)
    await db.createStudent(student)
    await db.createLesson(prereqLesson)
    await db.cleanupLessonLater(lesson)
    await db.cleanupCourseLater(course)
    done()
  },

  async after (browser, done) {
    await db.close()
    done()
  },

  'Instructor can create and edit lesson': browser => {
    const learningObjectiveText = 'Learn something new'

    browser
      // Sign in
      .signInUser(instructorRecord.get())

      // Navigate to lesson list
      .assert.visible('.main-nav a[href$=\'/lessons\']')
      .click('.main-nav a[href$=\'/lessons\']')
      .waitForElementVisible('a[href$=\'/lessons/new\']', waitTime)

      // Create new lesson
      .click('a[href$=\'/lessons/new\']')
      .waitForElementVisible('input[name=lesson-key]', waitTime)
      .setValue('select[name=lesson-category]', lessonKeyPrefix)
      .setValue('input[name=lesson-key]', lessonKeySuffix)
      .click('button')
      .waitForElementVisible('input[name=lesson-title]', waitTime)
      .assert.urlContains(`/lessons/${lesson.lessonKey}/edit`)

      // Edit lesson fields
      .setValue('input[name=lesson-title]', lesson.title)
      .setValue('input[name=lesson-estimated-hours]', lesson.estimatedHours)

      .setValue('input[name=lesson-new-learning-objective]', [
        learningObjectiveText,
        browser.Keys.ENTER
      ])

      .setValue('input[name=lesson-prereq-query]', prereqLesson.title)
      .waitForElementVisible('input[name=lesson-prereq-query] + .dropdown-results > .dropdown-result', waitTime)
      .click('input[name=lesson-prereq-query] + .dropdown-results > .dropdown-result')
      .waitForElementVisible('button[name=lesson-remove-prereq]', waitTime)

      // Save the form
      .click('button[name=done-button]:first-child')

      // Make sure the lesson is in the list of available lessons
      .waitForElementVisible('a[href$=\'/lessons/new\']', waitTime)
      .assert.visible(`a[href$='/lessons/${lesson.lessonKey}/edit']`)

      // View the recently edited lesson
      .click(`a[href$='/lessons/${lesson.lessonKey}/edit']`)
      .waitForElementVisible('input[name=lesson-title]', waitTime)
      .assert.value('input[name=lesson-title]', lesson.title)
      .assert.value('input[name=lesson-estimated-hours]', lesson.estimatedHours.toString())
      .assert.value('input[name=lesson-new-learning-objective] + ol input', learningObjectiveText)
      .assert.visible('button[name=lesson-remove-prereq]')

      // Close the browser and end the test
      .end()
  },

  'Instructor can create and edit course': browser => {
    browser
      // Sign in
      .signInUser(instructorRecord.get())

      // Navigate to course list
      .assert.visible('.main-nav a[href$=\'/courses\']')
      .click('.main-nav a[href$=\'/courses\']')
      .waitForElementVisible('a[href$=\'/courses/new\']', waitTime)

      // Create new course
      .click('a[href$=\'/courses/new\']')
      .waitForElementVisible('input[name=course-number]', waitTime)
      .setValue('select[name=course-prefix]', courseKeyDep)
      .setValue('input[name=course-number]', courseKeyNum)
      .setValue('select[name=course-semester]', courseKeySem)
      .setValue('input[name=course-year]', courseKeyYear)
      .setValue('input[name=course-section]', courseKeySec)
      .waitForElementPresent('button:not([DISABLED])', waitTime)
      .click('button:not([DISABLED])')
      .waitForElementVisible('input[name=course-title]', waitTime)
      .assert.urlContains(`/courses/${course.courseKey}/edit`)

      // Edit course fields
      .setValue('input[name=course-title]', course.title)
      .setValue('input[name=course-credits]', course.credits)

      // setValue sends keystrokes, so format the dates in the order you would type a date
      .setValue('input[name=course-start-date]', moment(course.startDate).format('MMDDYYYY'))
      .setValue('input[name=course-end-date]', moment(course.endDate).format('MMDDYYYY'))

      // Add a lesson to the course
      .setValue('input[name=course-lesson-query]', lesson.title)
      .waitForElementVisible('input[name=course-lesson-query] + .dropdown-results > .dropdown-result:first-child', waitTime)
      .click('input[name=course-lesson-query] + .dropdown-results > .dropdown-result:first-child')
      .waitForElementVisible('button[name=course-remove-lesson]', waitTime)

      // Type student email and press Enter to enroll
      .setValue('input[name=course-student-email]', [
        student.email,
        browser.Keys.ENTER
      ])
      .waitForElementVisible(`a[name='student-${student.email}']`, waitTime)

      // Save the form
      .click('button[name=done-button]:first-child')

      // Make sure the course is in the list of available courses
      .waitForElementVisible('a[href$=\'/courses/new\']', waitTime)
      .assert.visible(`a[href$='/courses/${course.courseKey}/edit']`)

      // View the recently edited course
      .click(`a[href$='/courses/${course.courseKey}/edit']`)
      .waitForElementVisible('input[name=course-title]', waitTime)
      .assert.value('input[name=course-title]', course.title)
      .assert.value('input[name=course-credits]', course.credits.toString())
      .assert.value('input[name=course-start-date]', moment(course.startDate).format('YYYY-MM-DD'))
      .assert.value('input[name=course-end-date]', moment(course.endDate).format('YYYY-MM-DD'))
      .assert.visible('button[name=course-remove-student]')
      .assert.visible('button[name=course-remove-lesson]')

      // Close the browser and end the test
      .end()
  }
}
