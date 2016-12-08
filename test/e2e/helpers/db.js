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

        let db = firebase.database()
        return Promise.all([
          db.ref('lessons/fieldGroups/large/instructor').child(lesson.key).set({
            notes: lesson.notes
          }),
          db.ref('lessons/fieldGroups/large/student').child(lesson.key).set({
            content: lesson.content
          }),
          db.ref('lessons/fieldGroups/small/instructor').child(lesson.key).set({
            learningObjectives: lesson.learningObjectives
          }),
          db.ref('lessons/fieldGroups/small/student').child(lesson.key).set({
            estimatedHours: lesson.estimatedHours,
            title: lesson.title
          }),
          db.ref('lessons/meta').child(lesson.key).set({
            createdAt: 1480827219022,
            createdBy: lesson.createdBy,
            updatedAt: 1480827219022,
            updatedBy: lesson.createdBy
          })
        ])
      },

      destroyLesson: function (lesson) {
        if (!lesson) return Promise.resolve()

        let db = firebase.database()
        return Promise.all([
          db.ref('lessons/fieldGroups/large/instructor').child(lesson.key).remove(),
          db.ref('lessons/fieldGroups/large/student').child(lesson.key).remove(),
          db.ref('lessons/fieldGroups/small/instructor').child(lesson.key).remove(),
          db.ref('lessons/fieldGroups/small/student').child(lesson.key).remove(),
          db.ref('lessons/meta').child(lesson.key).remove(),
          db.ref('lessons/relationships').child(lesson.key).remove()
        ])
      },

      // --------
      // COURSES
      // --------

      createCourse: function (course) {
        let courseCopy = Object.assign({}, course)
        delete courseCopy.key

        let db = firebase.database()
        let actions = [
          db.ref('courses/fieldGroups/large/authed').child(course.key).set({
            syllabus: course.syllabus
          }),
          db.ref('courses/fieldGroups/small/authed').child(course.key).set({
            credits: course.credits,
            startDate: course.startDate,
            endDate: course.endDate,
            title: course.title
          }),
          db.ref('courses/meta').child(course.key).set({
            createdAt: 1480827219022,
            createdBy: course.createdBy,
            updatedAt: 1480827219022,
            updatedBy: course.createdBy
          })
        ]

        if (course.lessonKeys || course.studentKeys) {
          let courseRelationships = {}

          if (course.lessonKeys) {
            // Relate course and lessons
            courseRelationships.lessons = {}
            Object.keys(course.lessonKeys).forEach(lessonKey => {
              courseRelationships.lessons[lessonKey] = {
                createdAt: 1480827219022,
                createdBy: course.createdBy
              }

              // Relate lesson to course and any students
              let lessonRelationships = {
                courses: {
                  [course.key]: {
                    createdAt: 1480827219022,
                    createdBy: course.createdBy
                  }
                }
              }
              if (course.studentKeys) {
                lessonRelationships.students = {}
                Object.keys(course.studentKeys).forEach(studentKey => {
                  lessonRelationships.students[studentKey] = {
                    courses: lessonRelationships.courses
                  }
                })
              }
              actions.push(db.ref('lessons/relationships').child(lessonKey).set(lessonRelationships))
            })
          }

          if (course.studentKeys) {
            // Relate course and students
            courseRelationships.students = {}
            Object.keys(course.studentKeys).forEach(studentKey => {
              courseRelationships.students[studentKey] = {
                createdAt: 1480827219022,
                createdBy: course.createdBy
              }
            })
          }

          actions.push(db.ref('courses/relationships').child(course.key).set(courseRelationships))
        }

        return Promise.all(actions)
      },

      destroyCourse: function (course) {
        if (!course) return Promise.resolve()

        let db = firebase.database()
        return Promise.all([
          db.ref('courses/fieldGroups/large/authed').child(course.key).remove(),
          db.ref('courses/fieldGroups/small/authed').child(course.key).remove(),
          db.ref('courses/meta').child(course.key).remove(),
          db.ref('courses/relationships').child(course.key).remove()
        ])
      }
    }
  }
}
