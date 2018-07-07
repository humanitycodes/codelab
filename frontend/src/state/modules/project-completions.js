import getProjectCompletions from '@api/project-completions/get-project-completions'

export default {
  state: {
    all: []
  },
  getters: {
    projectCompletions (state) {
      return state.all
    },
    currentProjectCompletion (state, getters) {
      const currentCourse = getters.currentCourse
      const currentLesson = getters.currentLesson
      if (currentCourse && currentLesson && getters.currentUser) {
        return getters.projectCompletions.find(projectCompletion => (
          projectCompletion.courseId === currentCourse.courseId &&
          projectCompletion.lessonId === currentLesson.lessonId &&
          projectCompletion.studentUserId === getters.currentUser.userId
        ))
      }
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
    },
    addProjectCompletion ({ commit }, { projectCompletion }) {
      commit('ADD_PROJECT_COMPLETION', projectCompletion)
    }
  },
  mutations: {
    ADD_PROJECT_COMPLETION (state, projectCompletion) {
      state.all.push(projectCompletion)
    },
    SET_ALL_PROJECT_COMPLETIONS (state, projectCompletions) {
      state.all = projectCompletions
    }
  }
}
