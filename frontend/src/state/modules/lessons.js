import getLesson from '@api/lessons/get-lesson'
import getLessons from '@api/lessons/get-lessons'
import mergeByIdAndVersion from './_helpers/merge-by-id-and-version'
import removeById from './_helpers/remove-by-id'

export default {
  state: {
    all: []
  },
  getters: {
    lessons (state) {
      return state.all
    },
    currentLesson (state, getters, rootState) {
      if (rootState.route.params && rootState.route.params.lessonKey) {
        const lessonKey = rootState.route.params.lessonKey
        return getters.lessons.find(lesson => lesson.lessonKey === lessonKey)
      }
    },
    editCurrentLessonPath (state, getters) {
      if (!getters.currentLesson) return ''
      return `/lessons/${getters.currentLesson.lessonKey}/edit`
    },
    showCurrentLessonPath (state, getters) {
      if (!getters.currentLesson) return ''
      return `/lessons/${getters.currentLesson.lessonKey}`
    }
  },
  actions: {
    syncLesson ({ dispatch }, lessonId) {
      // Get a specific lesson from the API and merge it with the others
      return getLesson(lessonId)
        .then(lesson =>
          dispatch('mergeLessons', [lesson])
          .then(() => lesson)
        )
        .catch(error => {
          if (error.response && error.response.status === 404) {
            // Resolve null to indicate lesson was removed
            return dispatch('removeLessons', [lessonId])
              .then(() => null)
          }
          throw error
        })
    },
    syncAllLessons ({ commit, getters }) {
      // Get all available lessons from API and save them in the local state
      return getLessons()
        .then(lessons => {
          // Download the complete current lesson before saving
          return Promise.resolve(getters.currentLesson)
            .then(currentLesson => {
              if (!currentLesson) return lessons
              return getLesson(currentLesson.lessonId)
                .then(completeCurrentLesson => mergeByIdAndVersion(
                  'lessonId', lessons, [completeCurrentLesson]
                ))
                .catch(() => lessons)
            })
            .then(newLessons => {
              commit('SET_ALL_LESSONS', newLessons)
              return newLessons
            })
        })
    },
    mergeLessons ({ commit, state }, lessons) {
      // Add or replace some lessons in the local state
      if (!lessons || !lessons.length) return
      const mergedLessons = mergeByIdAndVersion('lessonId', state.all, lessons)
      commit('SET_ALL_LESSONS', mergedLessons)
    },
    removeLessons ({ commit, state }, lessonIds) {
      // Remove some lessons from the local state
      if (!lessonIds || !lessonIds.length) return
      const lessons = removeById('lessonId', state.all, lessonIds)
      commit('SET_ALL_LESSONS', lessons)
    }
  },
  mutations: {
    SET_ALL_LESSONS (state, lessons) {
      state.all = lessons
    }
  }
}
