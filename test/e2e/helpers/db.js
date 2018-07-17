import sequelize from '../../../backend/dist/db/sequelize'
import createCourseRecord from '../../../backend/dist/db/course/create'
import readCourseRecordById from '../../../backend/dist/db/course/read-by-id'
import deleteCourseRecord from '../../../backend/dist/db/course/delete'
import createLessonRecord from '../../../backend/dist/db/lesson/create'
import readLessonRecordById from '../../../backend/dist/db/lesson/read-by-id'
import deleteLessonRecord from '../../../backend/dist/db/lesson/delete'
import createUserRecord from '../../../backend/dist/db/user/create'
import readUserRecordById from '../../../backend/dist/db/user/read-by-id'
import deleteUserRecord from '../../../backend/dist/db/user/delete'

export default {
  cleanupCourseIds: [],
  cleanupLessonIds: [],
  cleanupUserIds: [],

  // Call this in your test's "before" to connect your tests to the database
  async init () {
    try {
      this.cleanupCourseIds = []
      this.cleanupLessonIds = []
      this.cleanupUserIds = []

      await sequelize.authenticate()
      console.log('Successfully connected to database.')
    } catch (error) {
      console.error('Error connecting to database:', error)
      throw new Error('Unable to connect to database', error)
    }
  },

  // Call this in your test's "after" so Nightwatch shuts down properly
  async close () {
    return Promise.all(this.cleanupCourseIds.map(async id => {
      const record = await readCourseRecordById(id)
      if (record) await deleteCourseRecord(record)
    }))
    .then(() => Promise.all(this.cleanupLessonIds.map(async id => {
      const record = await readLessonRecordById(id)
      if (record) await deleteLessonRecord(record)
    })))
    .then(() => Promise.all(this.cleanupUserIds.map(async id => {
      const record = await readUserRecordById(id)
      if (record) await deleteUserRecord(record)
    })))
    .then(() => sequelize.close())
    .catch(error => {
      console.error('Error cleaning up after test:', error)
      console.warn(
        'Database may need to be cleaned up by hand.',
        '\nCourse IDs:', this.cleanupCourseIds,
        '\nLesson IDs:', this.cleanupLessonIds,
        '\nUser IDs:', this.cleanupUserIds
      )
      sequelize.close()
    })
  },

  cleanupCourseIdLater (id) {
    this.cleanupCourseIds.push(id)
  },

  cleanupLessonIdLater (id) {
    this.cleanupLessonIds.push(id)
  },

  cleanupUserIdLater (id) {
    this.cleanupUserIds.push(id)
  },

  // ------
  // USERS
  // ------

  async createUser (user) {
    const userRecord = await createUserRecord(user)
    this.cleanupUserIdLater(userRecord.userId)
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
    this.cleanupLessonIdLater(lessonRecord.lessonId)
    return lessonRecord
  },

  // --------
  // COURSES
  // --------

  async createCourse (course) {
    const courseRecord = await createCourseRecord(course)
    this.cleanupCourseIdLater(courseRecord.courseId)
    return courseRecord
  }
}
