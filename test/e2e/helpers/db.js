import sequelize from '../../../backend/dist/db/sequelize'
import createCourseRecord from '../../../backend/dist/db/course/create'
import readCourseRecordByKey from '../../../backend/dist/db/course/read-by-key'
import deleteCourseRecord from '../../../backend/dist/db/course/delete'
import createLessonRecord from '../../../backend/dist/db/lesson/create'
import readLessonRecordByKey from '../../../backend/dist/db/lesson/read-by-key'
import deleteLessonRecord from '../../../backend/dist/db/lesson/delete'
import createUserRecord from '../../../backend/dist/db/user/create'
import readUserRecordByEmail from '../../../backend/dist/db/user/read-by-email'
import deleteUserRecord from '../../../backend/dist/db/user/delete'

export default {
  cleanupCourseKeys: [],
  cleanupLessonKeys: [],
  cleanupUserEmails: [],

  // Call this in your test's "before" to connect your tests to the database
  async init () {
    try {
      this.cleanupCourseKeys = []
      this.cleanupLessonKeys = []
      this.cleanupUserEmails = []

      await sequelize.authenticate()
    } catch (error) {
      console.warn('Unable to connect to database. Reason:', error)
      throw error
    }
  },

  // Call this in your test's "after" so Nightwatch shuts down properly
  async close () {
    return Promise.all(this.cleanupCourseKeys.map(async courseKey => {
      const record = await readCourseRecordByKey(courseKey)
      if (record) await deleteCourseRecord(record)
    }))
    .then(() => Promise.all(this.cleanupLessonKeys.map(async lessonKey => {
      const record = await readLessonRecordByKey(lessonKey)
      if (record) await deleteLessonRecord(record)
    })))
    .then(() => Promise.all(this.cleanupUserEmails.map(async email => {
      const record = await readUserRecordByEmail(email)
      if (record) await deleteUserRecord(record)
    })))
    .catch(error => {
      console.error('Error cleaning up after test:', error)
      console.warn(
        'Database may need to be cleaned up by hand.',
        '\nCourse Keys:', this.cleanupCourseKeys,
        '\nLesson Keys:', this.cleanupLessonKeys,
        '\nUser Emails:', this.cleanupUserEmails
      )
    })
  },

  cleanupCourseLater (course) {
    this.cleanupCourseKeys.push(course.courseKey)
  },

  cleanupLessonLater (lesson) {
    this.cleanupLessonKeys.push(lesson.lessonKey)
  },

  cleanupUserLater (user) {
    this.cleanupUserEmails.push(user.email)
  },

  // ------
  // USERS
  // ------

  async createUser (user) {
    const userRecord = await createUserRecord(user)
    this.cleanupUserLater(userRecord)
    return userRecord
  },

  async createStudent (user) {
    user.isInstructor = false
    return this.createUser(user)
  },

  async createInstructor (user) {
    user.isInstructor = true
    return this.createUser(user)
  },

  // --------
  // LESSONS
  // --------

  async createLesson (lesson) {
    const lessonRecord = await createLessonRecord(lesson)
    this.cleanupLessonLater(lessonRecord)
    return lessonRecord
  },

  // --------
  // COURSES
  // --------

  async createCourse (course) {
    const courseRecord = await createCourseRecord(course)
    this.cleanupCourseLater(courseRecord)
    return courseRecord
  }
}
