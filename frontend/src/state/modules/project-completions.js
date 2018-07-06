import getProjectCompletions from '@api/project-completions/get-project-completions'

export default {
  state: {
    all: []
  },
  getters: {
    projectCompletions (state) {
      return state.all
    },
    currentProjectCompletion (state, getters, rootState) {
      const currentCourse = getters.currentCourse
      const currentLesson = getters.currentLesson
      if (!currentCourse || !currentLesson) return null
      return getters.projectCompletions.find(projectCompletion => (
        projectCompletion.courseId === currentCourse.courseId &&
        projectCompletion.lessonId === currentLesson.lessonId &&
        projectCompletion.studentUserId === getters.currentUser.userId
      ))
    }
  },
  actions: {
    syncAllProjectCompletions ({ commit }) {
      return getProjectCompletions()
        .then(projectCompletions => {
          commit('SET_ALL_PROJECT_COMPLETIONS', projectCompletions)
        })
        .catch(error => {
          commit('SET_ALL_PROJECT_COMPLETIONS', [])
          throw error
        })
    }
  },
  mutations: {
    SET_ALL_PROJECT_COMPLETIONS (state, projectCompletions) {
      state.all = projectCompletions
    }
  }
}
