import getLessons from '@api/lessons/get-lessons'

export default {
  state: {
    all: []
  },
  getters: {
    lessons (state) {
      return state.all
    },
    currentLesson (state, getters, rootState) {
      const lessonKey = rootState.route.params['lessonKey']
      return getters.lessons.find(lesson => lesson.lessonKey === lessonKey)
    }
  },
  actions: {
    syncAllLessons ({ commit }) {
      getLessons()
      .then(lessons => commit('SET_ALL_LESSONS', lessons))
      .catch(error => {
        commit('SET_ALL_LESSONS', [])
        throw error
      })
    }
  },
  mutations: {
    SET_ALL_LESSONS (state, lessons) {
      state.all = lessons
    }
  }
}
