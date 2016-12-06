const firebaseAdmin = require('firebase-admin')
const uuid = require('uuid')

const firebaseSettings = require('../../../backend/src/firebase-settings')

const DEFAULT_PASSWORD = 'toomanysecrets'

module.exports = {
  init: function () {
    const firebase = firebaseAdmin.initializeApp(firebaseSettings.appConfig, uuid.v4())
    return {
      // Call this in your test's 'after' so Nightwatch shuts down properly
      close: () => {
        return firebase.delete()
      },
      // ------
      // USERS
      // ------

      getDefaultPassword: function () {
        return DEFAULT_PASSWORD
      },

      createUser: function  (user, roles) {
        let db = firebase.database()
        return Promise.all([
          firebase.auth().createUser({
            uid: user.uid,
            email: user.email,
            emailVerified: true,
            displayName: user.fullName,
            password: DEFAULT_PASSWORD
          }),
          db.ref('users').child(user.uid).set({
            email: user.email,
            fullName: user.fullName
          }),
          db.ref('roles').child(user.uid).set(roles)
        ])
      },

      createStudent: function (user) {
        return this.createUser(user, { instructor: false })
      },

      createInstructor: function (user) {
        return this.createUser(user, { instructor: true })
      },

      destroyUser: function (user) {
        if (!user) return Promise.resolve()

        let db = firebase.database()
        return Promise.all([
          db.ref('roles').child(user.uid).remove(),
          db.ref('users').child(user.uid).remove(),
          firebase.auth().deleteUser(user.uid)
        ])
      },

      // --------
      // LESSONS
      // --------

      createLesson: function (lesson) {
        let lessonCopy = Object.assign({}, lesson)
        delete lessonCopy.key

        return firebase.database().ref('lessons').child(lesson.key).set(lessonCopy)
      },

      destroyLesson: function (lesson) {
        if (!lesson) return Promise.resolve()
        return firebase.database().ref('lessons').child(lesson.key).remove()
      },

      // --------
      // COURSES
      // --------

      createCourse: function (course) {
        let courseCopy = Object.assign({}, course)
        delete courseCopy.key

        return firebase.database().ref('courses').child(course.key).set(courseCopy)
      },

      destroyCourse: function (course) {
        if (!course) return Promise.resolve()
        return firebase.database().ref('courses').child(course.key).remove()
      }
    }
  }
}
