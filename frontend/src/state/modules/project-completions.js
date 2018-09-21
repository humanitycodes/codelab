import getProjectCompletion from '@api/project-completions/get-project-completion'
import getProjectCompletions from '@api/project-completions/get-project-completions'
import mergeByIdAndVersion from './_helpers/merge-by-id-and-version'
import removeById from './_helpers/remove-by-id'

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
    syncProjectCompletion ({ dispatch }, projectCompletionId) {
      // Get a specific project completion from the API and merge it
      return getProjectCompletion(projectCompletionId)
        .then(projectCompletion =>
          dispatch('mergeProjectCompletions', [projectCompletion])
        )
    },
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
    mergeProjectCompletions ({ commit, state }, projectCompletions) {
      // Add or replace some project completions in the local state
      if (!projectCompletions || !projectCompletions.length) return
      const mergedProjectCompletions = mergeByIdAndVersion(
        'projectCompletionId', state.all, projectCompletions
      )
      commit('SET_ALL_PROJECT_COMPLETIONS', mergedProjectCompletions)
    },
    removeProjectCompletions ({ commit, state }, projectCompletionIds) {
      // Remove some project completions from the local state
      if (!projectCompletionIds || !projectCompletionIds.length) return
      const projectCompletions = removeById(
        'projectCompletionId', state.all, projectCompletionIds
      )
      commit('SET_ALL_PROJECT_COMPLETIONS', projectCompletions)
    }
  },
  mutations: {
    SET_ALL_PROJECT_COMPLETIONS (state, projectCompletions) {
      state.all = projectCompletions
    }
  }
}
