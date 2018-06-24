import getCourses from '@api/courses/get-courses'

export default {
  state: {
    all: []
  },
  actions: {
    getAllCourses ({ commit }) {
      getCourses()
      .then(courses => commit('SET_ALL_COURSES', courses))
      .catch(error => {
        commit('SET_ALL_COURSES', [])
        return Promise.reject(error)
      })
    }
  },
  mutations: {
    SET_ALL_COURSES (state, courses) {
      state.all = courses
    }
  }
}
