import getCourses from '@api/courses/get-courses'
import mergeByIdAndVersion from './_helpers/merge-by-id-and-version'

export default {
  state: {
    all: []
  },
  getters: {
    courses (state) {
      return state.all
    },
    currentCourse (state, getters, rootState) {
      if (rootState.route.params && rootState.route.params.courseKey) {
        const courseKey = rootState.route.params.courseKey
        return getters.courses.find(course => course.courseKey === courseKey)
      }
    },
    editCurrentCoursePath (state, getters) {
      if (!getters.currentCourse) return ''
      return `/courses/${getters.currentCourse.courseKey}/edit`
    },
    showCurrentCoursePath (state, getters) {
      if (!getters.currentCourse) return ''
      return `/courses/${getters.currentCourse.courseKey}`
    }
  },
  actions: {
    syncAllCourses ({ commit }) {
      return getCourses()
        .then(courses => commit('SET_ALL_COURSES', courses))
        .catch(error => {
          commit('SET_ALL_COURSES', [])
          throw error
        })
    },
    mergeCourses ({ commit, state }, courses) {
      // Add or replace some courses in the local state
      if (!courses || !courses.length) return
      const mergedCourses = mergeByIdAndVersion('courseId', state.all, courses)
      commit('SET_ALL_COURSES', mergedCourses)
    }
  },
  mutations: {
    SET_ALL_COURSES (state, courses) {
      state.all = courses
    }
  }
}
