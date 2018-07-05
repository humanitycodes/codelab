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
    },
    editCurrentLessonPath (state, getters) {
      return `/lessons/${getters.currentLesson.lessonKey}/edit`
    },
    showCurrentLessonPath (state, getters) {
      return `/lessons/${getters.currentLesson.lessonKey}`
    }
  },
  actions: {
    syncAllLessons ({ commit }) {
      return getLessons()
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
