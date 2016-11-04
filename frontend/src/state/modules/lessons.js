import Vue from 'vue'
import db from '@plugins/firebase'

const firebaseComponent = new Vue({
  firebase: {
    lessons: db.ref('lessons')
  }
})

export default {
  state: {
    all: []
  },
  getters: {
    currentLesson (state, getters, rootState) {
      const currentKey = rootState.route.params.lessonKey
      const lessons = state.all
      if (lessons.length && currentKey) {
        return lessons.find(lesson => {
          return lesson['.key'] === currentKey
        })
      }
    }
  },
  actions: {
    syncLessons ({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        // If Firebase already has lessons
        if (firebaseComponent.lessons.length) {
          commit('SET_LESSONS', firebaseComponent.lessons)
          resolve(rootState)
        }
        firebaseComponent.$watch('lessons', (newLessons, oldLessons) => {
          commit('SET_LESSONS', newLessons)
          resolve(rootState)
        })
      })
    },
    createLesson ({ rootState }, lessonKey) {
      return db.ref('lessons').child(lessonKey).set({
        createdBy: rootState.users.currentUser.uid
      })
    },
    updateLesson (_, updatedLessonObject) {
      // Whitelisting what can be edited, with defaults
      const editableFields = {
        title: '',
        content: '',
        notes: '',
        learningObjectives: {},
        prereqKeys: {}
      }
      return db.ref('lessons')
        .child(updatedLessonObject['.key'])
        .update(
          Object.keys(editableFields)
            .map(field => ({
              [field]: updatedLessonObject[field] || editableFields[field]
            }))
            .reduce((a, b) => Object.assign({}, a, b))
        )
    },
    destroyLesson (_, lessonKey) {
      return db.ref('lessons').child(lessonKey).remove()
    },
    addLessonPrereq (_, { lessonKey, prereqKey }) {
      return db.ref('lessons')
        .child(lessonKey)
        .child('prereqKeys')
        .child(prereqKey)
        .set(true)
    },
    removeLessonPrereq (_, { lessonKey, prereqKey }) {
      return db.ref('lessons')
        .child(lessonKey)
        .child('prereqKeys')
        .child(prereqKey)
        .remove()
    }
  },
  mutations: {
    SET_LESSONS (state, newLessons) {
      state.all = newLessons
    }
  }
}
