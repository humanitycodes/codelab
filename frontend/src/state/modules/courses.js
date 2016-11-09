import db from '@plugins/firebase'
import { canUpdateCourse, canDestroyCourse } from '@state/authorization/courses'
import { createFirebaseVM } from './_helpers'

export default {
  state: {
    all: []
  },
  getters: {
    currentCourse (state, getters, rootState) {
      const currentKey = rootState.route.params.courseKey
      const courses = state.all
      if (courses.length && currentKey) {
        return courses.find(course => {
          return course['.key'] === currentKey
        })
      }
    },
    showCurrentCoursePath (state, getters) {
      if (!getters.currentCourse) return null
      const courseKey = getters.currentCourse['.key']
      return `/courses/${courseKey}`
    },
    editCurrentCoursePath (state, getters) {
      if (!getters.currentCourse) return null
      const courseKey = getters.currentCourse['.key']
      return `/courses/${courseKey}/edit`
    },
    canUpdateCurrentCourse (state, getters) {
      if (!getters.currentCourse) return false
      return canUpdateCourse({
        courseKey: getters.currentCourse['.key']
      })
    },
    canDestroyCurrentCourse (state, getters) {
      if (!getters.currentCourse) return false
      return canDestroyCourse({
        courseKey: getters.currentCourse['.key']
      })
    }
  },
  actions: {
    syncCourses ({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        createFirebaseVM({
          courses: db.ref('courses')
        })
        .then(vm => {
          commit('SET_COURSES', vm.courses)
          resolve(rootState)
          vm.$watch('courses', (newCourses, oldCourses) => {
            commit('SET_COURSES', newCourses)
          })
        })
        .catch(resolve)
      })
    },
    createCourse ({ rootState }, courseKey) {
      return db.ref('courses').child(courseKey).set({
        createdBy: rootState.users.currentUser.uid
      })
    },
    updateCourse (_, updatedCourseObject) {
      // Whitelisting what can be edited, with defaults
      const editableFields = {
        title: '',
        syllabus: '',
        startDate: '',
        endDate: '',
        lessonKeys: {},
        studentKeys: {}
      }
      return db.ref('courses')
        .child(updatedCourseObject['.key'])
        .update(
          Object.keys(editableFields)
            .map(field => ({
              [field]: updatedCourseObject[field] || editableFields[field]
            }))
            .reduce((a, b) => Object.assign({}, a, b))
        )
    },
    destroyCourse (_, courseKey) {
      return db.ref('courses').child(courseKey).remove()
    },
    addCourseLesson (_, { courseKey, prereqKey }) {
      return db.ref('courses')
        .child(courseKey)
        .child('prereqKeys')
        .child(prereqKey)
        .set(true)
    },
    removeCourseLesson (_, { courseKey, prereqKey }) {
      return db.ref('courses')
        .child(courseKey)
        .child('prereqKeys')
        .child(prereqKey)
        .remove()
    }
  },
  mutations: {
    SET_COURSES (state, newCourses) {
      state.all = newCourses
    }
  }
}
