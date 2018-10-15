import getCourse from '@api/courses/get-course'
import getCourses from '@api/courses/get-courses'
import mergeByIdAndVersion from './_helpers/merge-by-id-and-version'
import removeById from './_helpers/remove-by-id'

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
    syncCourse ({ dispatch }, courseId) {
      // Get a specific course from the API and merge it with the others
      return getCourse(courseId)
        .then(course =>
          // Merge the course and sync the lessons in case the course
          // includes lessons previously not accessible to the user
          dispatch('mergeCourses', [course])
          .then(() => dispatch('syncAllLessons'))
          .then(() => course)
        )
        .catch(error => {
          if (error.response && error.response.status === 404) {
            // Resolve null to indicate course was removed
            return dispatch('removeCourses', [courseId])
              .then(() => null)
          }
          throw error
        })
    },
    syncAllCourses ({ commit }) {
      return getCourses()
        .then(courses => {
          commit('SET_ALL_COURSES', courses)
          return courses
        })
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
    },
    removeCourses ({ commit, state }, courseIds) {
      // Remove some courses from the local state
      if (!courseIds || !courseIds.length) return
      const courses = removeById('courseId', state.all, courseIds)
      commit('SET_ALL_COURSES', courses)
    }
  },
  mutations: {
    SET_ALL_COURSES (state, courses) {
      state.all = courses
    }
  }
}
