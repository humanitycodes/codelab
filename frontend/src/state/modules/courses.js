import getCourses from '@api/courses/get-courses'

export default {
  state: {
    all: []
  },
  getters: {
    courses (state) {
      return state.all
    }
  },
  actions: {
    syncAllCourses ({ commit }) {
      getCourses()
      .then(courses => commit('SET_ALL_COURSES', courses))
      .catch(error => {
        commit('SET_ALL_COURSES', [])
        throw error
      })
    }
  },
  mutations: {
    SET_ALL_COURSES (state, courses) {
      state.all = courses
    }
  }
}
