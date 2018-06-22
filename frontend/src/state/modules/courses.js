import Axios from 'axios'

export default {
  state: {
    all: []
  },
  actions: {
    fetchAllCourses ({ commit }) {
      Axios.get('/api/courses')
      .then(response => {
        const courses = response.data
        commit('SET_ALL_COURSES', courses)
        return Promise.resolve(courses)
      })
      .catch(error => {
        console.log('Error fetching all courses:', error)
        commit('SET_ALL_COURSES', [])
        return Promise.reject(error)
      })
    }
  },
  mutations: {
    SET_ALL_COURSES (state, newCourses) {
      state.courses = newCourses
    }
  }
}
